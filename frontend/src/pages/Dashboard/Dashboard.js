import "./Dashboard.css";
import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import useRedirectIfLoggedOut from "../../hooks/useRedirectIfLoggedOut";
import axios from "axios";
import { Box, Typography, Button, Link, CircularProgress } from "@mui/material";
import { BsBoxSeamFill } from "react-icons/bs";
import BoxCard from "../../components/BoxCard/BoxCard";
import CustomModal from "../../components/CustomModal/CustomModal";

const Dashboard = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const { checkingIfLoggedOut } = useRedirectIfLoggedOut();
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteBoxModalMessage, setDeleteBoxModalMessage] = useState("");
  const [deleteBoxId, setDeleteBoxId] = useState(-1);

  useEffect(() => {
    async function getBoxes() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/box-king/box`,
          {
            withCredentials: true,
          }
        );
        setBoxes(response.data.boxes);
        setLoading(false);
      } catch (error) {
        if (error.response?.status === 401) {
          setUser(null);
          navigate("/login");
        } else {
          setError(true);
          setLoading(false);
          console.error(error);
        }
      }
    }
    getBoxes();
  }, [navigate, setUser]);

  const handleOpenDeleteModal = (box_name, box_id) => {
    setDeleteBoxModalMessage(
      `Are you sure you want to delete this box (${box_name})? All
      items will be lost. This action cannot be reversed.`
    );
    setDeleteBoxId(box_id);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/box-king/box/${deleteBoxId}`,
        { withCredentials: true }
      );
      handleCloseDeleteModal();
      navigate(0);
    } catch (error) {
      console.error(error);
    }
  };

  if (checkingIfLoggedOut) return null;

  if (loading) {
    return (
      <Typography className="get-boxes-status">
        <CircularProgress />
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography className="get-boxes-status">
        An error has occured.
      </Typography>
    );
  }

  return (
    <Box className="page-container">
      <Box className="dashboard-container">
        <CustomModal
          openModal={openDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDelete}
          deleteRequest={true}
          message={deleteBoxModalMessage}
        />
        <Box className="dashboard-header">
          <Link className="create-box-link" href="/box/create-box">
            <Button className="create-box-button" variant="contained">
              <BsBoxSeamFill /> Create Box
            </Button>
          </Link>
        </Box>
        <Box className="boxes-container">
          {boxes.map((box) => (
            <BoxCard
              key={box.id}
              box_name={box.box_name}
              box_id={box.id}
              handleOpenDeleteModal={handleOpenDeleteModal}
            />
          ))}
          {boxes.length === 0 && (
            <Typography variant="h6">
              Oh no, your dashboard is empty—let’s fix that! Create a box to get
              started!
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
