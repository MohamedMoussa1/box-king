import "./BoxDetail.css";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import useRedirectIfLoggedOut from "../../hooks/useRedirectIfLoggedOut";
import { useEffect, useState } from "react";
import axios from "axios";
import BoxItemsTable from "../../components/BoxItemsTable/BoxItemsTable";
import CustomModal from "../../components/CustomModal/CustomModal";

const BoxDetail = () => {
  const { checkingIfLoggedOut } = useRedirectIfLoggedOut();
  const { box_id } = useParams();
  const [boxDetail, setBoxDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
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
        <Button
          className="delete-button"
          variant="contained"
          onClick={handleOpenDeleteModal}
        >
          <DeleteIcon /> Delete Box
        </Button>
        <Box className="box-detail-header">
          <Box className="box-detail-header-top">
            <Box className="box-detail-header-top-left">
              <Typography variant="h6">{boxDetail.box_name}</Typography>
            </Box>
            <Button
              href={`${process.env.REACT_APP_API_URL}/box-king/box/${box_id}/qr-code`}
              target="_blank"
              className="generate-qr-code-button"
              variant="contained"
            >
              <QrCode2Icon /> Generate
            </Button>
          </Box>
          <Typography>
            {boxDetail.box_description || "No description available"}
          </Typography>
        </Box>
        <Box className="box-detail-table">
          <BoxItemsTable box_id={box_id} box_items={boxDetail.box_items} />
        </Box>
      </Box>
    </Box>
  );
};

export default BoxDetail;
