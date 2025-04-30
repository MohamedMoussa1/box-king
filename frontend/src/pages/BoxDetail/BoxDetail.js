import "./BoxDetail.css";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Button, TextField } from "@mui/material";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import useRedirectIfLoggedOut from "../../hooks/useRedirectIfLoggedOut";
import { useEffect, useState } from "react";
import axios from "axios";
import BoxItemsTable from "../../components/BoxItemsTable/BoxItemsTable";
import CustomModal from "../../components/CustomModal/CustomModal";
import CustomSnackBar from "../../components/CustomSnackBar/CustomSnackBar";

const BoxDetail = () => {
  const { checkingIfLoggedOut } = useRedirectIfLoggedOut();
  const { box_id } = useParams();
  const [boxDetail, setBoxDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [boxName, setBoxName] = useState("");
  const [boxDescription, setBoxDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState({});
  const [snackBarKey, setSnackBarKey] = useState(0);
  const deleteBoxModalMessage = `Are you sure you want to delete this box (${boxDetail.box_name})? All
  items will be lost. This action cannot be reversed.`;
  const navigate = useNavigate();

  useEffect(() => {
    async function getBox() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/box-king/box/${box_id}`,
          { withCredentials: true }
        );
        setBoxDetail(response.data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
        console.error(error);
      }
    }
    getBox();
  }, [box_id]);

  const handleOpenDeleteModal = () => setOpenDeleteModal(true);

  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/box-king/box/${box_id}`,
        { withCredentials: true }
      );
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setBoxName(boxDetail.box_name);
    setBoxDescription(boxDetail.box_description);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSnackBarKey((prev) => prev + 1);
    const updatedBoxDetails = {
      box_name: boxName,
      box_description: boxDescription,
    };
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/box-king/box/${box_id}`,
        updatedBoxDetails,
        { withCredentials: true }
      );
      navigate(0);
    } catch (error) {
      console.error(error);
      const response = error.response;
      if (
        response.data.error_type === "integrity_error" &&
        response.data.message.includes("unique_box_name_per_user")
      ) {
        setSaveError({
          duplicateBoxName:
            "Oops! A box with this name already exists. Please choose a different name.",
        });
      } else {
        setSaveError({ unexpectedError: "Cannot save changes." });
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (checkingIfLoggedOut) return null;

  if (loading) {
    return <Typography className="get-box-status">Loading...</Typography>;
  }

  if (error) {
    return (
      <Typography className="get-box-status">An error has occured.</Typography>
    );
  }

  return (
    <Box className="page-container">
      <Box className="box-detail-container">
        <CustomModal
          openModal={openDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDelete}
          deleteRequest={true}
          message={deleteBoxModalMessage}
        />
        {Object.keys(saveError).map((error) => {
          return (
            <CustomSnackBar
              message={saveError[error]}
              severity="error"
              key={snackBarKey}
            />
          );
        })}
        <Box className="box-operation-container">
          {isEditing ? (
            <>
              <Button
                className="save-button"
                variant="contained"
                onClick={handleSave}
                disabled={isSaving}
              >
                <SaveIcon /> Save Changes
              </Button>
              <Button
                className="cancel-button"
                variant="contained"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <CancelIcon /> Cancel Editing
              </Button>
            </>
          ) : (
            <>
              <Button
                className="edit-button"
                variant="contained"
                onClick={handleEdit}
              >
                <EditIcon /> Edit Box
              </Button>
              <Button
                className="delete-button"
                variant="contained"
                onClick={handleOpenDeleteModal}
              >
                <DeleteIcon /> Delete Box
              </Button>
            </>
          )}
        </Box>
        <Box className="box-detail-header">
          <Box className="box-detail-header-top">
            <Box className="box-detail-header-top-left">
              {isEditing ? (
                <TextField
                  id="outlined-basic"
                  label="Box Name"
                  variant="outlined"
                  value={boxName}
                  onChange={(e) => setBoxName(e.target.value)}
                  slotProps={{
                    htmlInput: { maxLength: 30 },
                  }}
                  fullWidth
                />
              ) : (
                <Typography variant="h6">{boxDetail.box_name}</Typography>
              )}
            </Box>
            <Button
              href={`${process.env.REACT_APP_API_URL}/box-king/box/${box_id}/qr-code`}
              target="_blank"
              className="generate-qr-code-button"
              variant="contained"
              style={isEditing ? { display: "None" } : {}}
            >
              <QrCode2Icon /> Generate
            </Button>
          </Box>
          {isEditing ? (
            <TextField
              id="outlined-basic"
              label="Description"
              variant="outlined"
              value={boxDescription}
              onChange={(e) => setBoxDescription(e.target.value)}
              slotProps={{
                htmlInput: { maxLength: 200 },
              }}
              fullWidth
            />
          ) : (
            <Typography className="box-description">
              {boxDetail.box_description || "No description available"}
            </Typography>
          )}
        </Box>
        <Box className="box-detail-table">
          <BoxItemsTable box_id={box_id} box_items={boxDetail.box_items} />
        </Box>
      </Box>
    </Box>
  );
};

export default BoxDetail;
