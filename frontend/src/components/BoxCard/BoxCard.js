import "./BoxCard.css";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { FaBox, FaBoxOpen } from "react-icons/fa";

const BoxCard = () => {
  return (
    <Box className="card-container">
      <Button component={Link} to="#" className="card-top">
        <FaBox className="box-icon" />
        <FaBoxOpen className="box-icon-hover" />
      </Button>
      <Box className="card-bottom">
        <Typography className="card-name">Placeholder</Typography>
        <Button className="card-button">
          <MoreVertIcon fontSize="medium" />
        </Button>
      </Box>
    </Box>
  );
};

export default BoxCard;
