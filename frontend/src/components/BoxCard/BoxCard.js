import "./BoxCard.css";
import {
  Box,
  Button,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { FaBox, FaBoxOpen } from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { useState } from "react";

const BoxCard = ({ box_name, box_id, handleOpenDeleteModal }) => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleRedirect = () => {
    navigate(`/box/${box_id}`);
  };

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenu(false);
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
        <>
          <Button className="card-button" onClick={handleOpen}>
            <MoreVertIcon fontSize="medium" />
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            disableScrollLock={true}
            slotProps={{
              paper: {
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                  },
                },
              },
            }}
          >
            <MenuItem onClick={() => handleOpenDeleteModal(box_name, box_id)}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              Delete
            </MenuItem>
          </Menu>
        </>
      </Box>
    </Box>
  );
};

export default BoxCard;
