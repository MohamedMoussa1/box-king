import "./BoxItemsTable.css";
import { Box, Button } from "@mui/material";
import CustomSnackBar from "../CustomSnackBar/CustomSnackBar";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { useState } from "react";
import axios from "axios";

const BoxItemsTable = ({ box_id, box_items }) => {
  const initialRows = box_items.map((item) => ({
    ...item,
    id: -item.id,
    db_item_id: item.id,
  }));
  const [rows, setRows] = useState(initialRows);
  const [rowModesModel, setRowModesModel] = useState({});
  const [gridKey, setGridKey] = useState(0);
  const [snackBarKey, setSnackBarKey] = useState(0);
  const [rowFormErrors, setRowFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
      const row_id = Date.now();
      setRows((oldRows) => [
        ...oldRows,
        {
          id: row_id,
          item_name: "",
          quantity: "",
          db_item_id: null,
          isNew: true,
        },
      ]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [row_id]: { mode: GridRowModes.Edit, fieldToFocus: "item_name" },
      }));
    };

    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add Item
        </Button>
      </GridToolbarContainer>
    );
  }

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setIsSaving(true);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => async () => {
    setIsDeleting(true);
    setDeleteSuccess(false);
    setRowFormErrors({});
    const db_item_id = rows.filter((row) => row.id === id)[0].db_item_id;
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/box-king/box/${box_id}/item/${db_item_id}`,
        { withCredentials: true }
      );
      setRows(rows.filter((row) => row.id !== id));
      setGridKey((prev) => prev + 1);
      setDeleteSuccess(true);
    } catch (error) {
      setRowFormErrors({ delete: "Cannot delete item." });
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelClick = (id) => async () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
    setGridKey((prev) => prev + 1);
  };

  const validateRowForm = (newRow) => {
    const { item_name, quantity } = newRow;
    const newRowFormErrors = {};
    if (!item_name || item_name.length > 50) {
      newRowFormErrors.item_name =
        "Item name must be between 1 to 50 characters.";
    } else if (quantity < 1) {
      newRowFormErrors.quantity = "Item quantity must be at least 1.";
    }
    if (Object.keys(newRowFormErrors).length > 0) {
      setRowFormErrors(newRowFormErrors);
      setSnackBarKey((prev) => prev + 1);
      return false;
    }
    setRowFormErrors({});
    return true;
  };

  const addItem = async (newRow) => {
    setIsSaving(true);
    const itemData = {
      item_name: newRow.item_name,
      quantity: newRow.quantity,
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/box-king/box/${box_id}/item`,
        itemData,
        { withCredentials: true }
      );
      newRow = {
        ...newRow,
        quantity: Math.trunc(newRow.quantity),
        db_item_id: response.data.id,
      };
    } catch (error) {
      console.error(error);
      const response = error.response;
      if (
        response.data.error_type === "integrity_error" &&
        response.data.message.includes("unique_item_name_per_box")
      ) {
        const duplicateName = newRow.item_name;
        newRow = null;
        setRowFormErrors({
          item_name: `${duplicateName} is already in your box.`,
        });
      }
    } finally {
      setIsSaving(false);
    }
    return newRow;
  };

  const updateItem = async (newRow) => {
    setIsSaving(true);
    const itemData = {
      item_name: newRow.item_name,
      quantity: newRow.quantity,
    };
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/box-king/box/${box_id}/item/${newRow.db_item_id}`,
        itemData,
        { withCredentials: true }
      );
      newRow = {
        ...newRow,
        quantity: Math.trunc(newRow.quantity),
      };
    } catch (error) {
      console.error(error);
      const response = error.response;
      if (
        response.data.error_type === "integrity_error" &&
        response.data.message.includes("unique_item_name_per_box")
      ) {
        const duplicateName = newRow.item_name;
        newRow = null;
        setRowFormErrors({
          item_name: `${duplicateName} is already in your box.`,
        });
      }
    } finally {
      setIsSaving(false);
    }
    return newRow;
  };

  const onProcessRowUpdateError = (error) => {
    console.error("Error Occured:", error);
  };

  const processRowUpdate = async (newRow) => {
    setSaveSuccess(false);
    if (!validateRowForm(newRow)) {
      setIsSaving(false);
      return;
    }
    if (newRow.isNew) {
      newRow = await addItem(newRow);
    } else {
      newRow = await updateItem(newRow);
    }
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    setSaveSuccess(true);
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: "item_name",
      headerName: "Item",
      flex: 3,
      editable: true,
    },
    {
      field: "quantity",
      headerName: "Qty",
      type: "number",
      flex: 2,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1.5,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
              disabled={isSaving || isDeleting}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
              disabled={isSaving || isDeleting}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
            disabled={isSaving || isDeleting}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
            disabled={isSaving || isDeleting}
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      {saveSuccess && (
        <CustomSnackBar message="Item saved successfully!" severity="success" />
      )}
      {deleteSuccess && (
        <CustomSnackBar
          message="Item deleted successfully!"
          severity="success"
        />
      )}
      {Object.keys(rowFormErrors).map((error) => {
        return (
          <CustomSnackBar
            message={rowFormErrors[error]}
            severity="error"
            key={snackBarKey}
          />
        );
      })}
      <DataGrid
        key={gridKey}
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={onProcessRowUpdateError}
        slots={{ toolbar: EditToolbar }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
    </Box>
  );
};

export default BoxItemsTable;
