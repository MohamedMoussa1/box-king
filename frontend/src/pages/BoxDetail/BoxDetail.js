import "./BoxDetail.css";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import useRedirectIfLoggedOut from "../../hooks/useRedirectIfLoggedOut";
import { useEffect, useState } from "react";
import axios from "axios";

const BoxDetail = () => {
  const { checkingIfLoggedOut } = useRedirectIfLoggedOut();
  const { box_id } = useParams();
  const [boxDetail, setBoxDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
        <Box className="box-detail-header">
          <Typography variant="h6">{boxDetail.box_name}</Typography>

          <Typography>Description: {boxDetail.box_description}</Typography>
        </Box>
        <Box className="box-detail-table">
          <Typography>Box Items Table Placeholder</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default BoxDetail;
