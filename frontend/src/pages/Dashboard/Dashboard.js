import "./Dashboard.css";
import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import useRedirectIfLoggedOut from "../../hooks/useRedirectIfLoggedOut";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import BoxCard from "../../components/BoxCard/BoxCard";

const Dashboard = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const { checkingIfLoggedOut } = useRedirectIfLoggedOut();
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  if (checkingIfLoggedOut) return null;

  if (loading) {
    return <Typography className="get-boxes-status">Loading...</Typography>;
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
        {boxes.map((box) => (
          <BoxCard key={box.id} box_name={box.box_name} box_id={box.id} />
        ))}
      </Box>
    </Box>
  );
};

export default Dashboard;
