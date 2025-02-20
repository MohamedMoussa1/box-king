import "./BoxCard.css";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { FaBox, FaBoxOpen } from "react-icons/fa";

const BoxCard = ({ box_name, box_id }) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate(`/box/${box_id}`);
  };

  return (
    <Box className="card-container">
      <Button onClick={handleRedirect} className="card-top">
        <FaBox className="box-icon" />
        <FaBoxOpen className="box-icon-hover" />
      </Button>
      <Box className="card-bottom">
        <Typography className="card-name" title={box_name}>
          {box_name}
        </Typography>
        <Button className="card-button">
          <MoreVertIcon fontSize="medium" />
        </Button>
      </Box>
    </Box>
  );
};

export default BoxCard;
