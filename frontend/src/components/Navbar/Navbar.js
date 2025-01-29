import "./Navbar.css";
import axios from "axios";
import { Box, Button, Menu, MenuItem, ListItemIcon } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useState } from "react";
import Logout from "@mui/icons-material/Logout";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";

const Navbar = () => {
  const { user, setUser } = useUser();
  const [openMenu, setOpenMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenu(false);
  };
  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/box-king/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
      handleClose();
    } catch (error) {
      console.error("Error Occured:", error);
    }
  };

  return (
    <Box className="navbar-container">
      <NavLink to="/" className="banner">
        Box King
      </NavLink>
      <Box className="navbar-right">
        {user ? (
          <>
            <Button onClick={handleOpen}>{user.username}</Button>
            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
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
              <MenuItem onClick={handleClose} className="navbar-link">
                <ListItemIcon>
                  <SpaceDashboardIcon fontSize="small" />
                </ListItemIcon>
                <NavLink
                  to="/"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Dashboard
                </NavLink>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <NavLink to="/login" className="navbar-link">
              <Button
                variant="contained"
                className="navbar-button login-button"
              >
                Login
              </Button>
            </NavLink>
            <NavLink to="/register" className="navbar-link">
              <Button
                variant="contained"
                className="navbar-button register-button"
              >
                Get Started
              </Button>
            </NavLink>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Navbar;
