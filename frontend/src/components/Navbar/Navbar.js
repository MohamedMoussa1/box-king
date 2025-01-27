import "./Navbar.css";
import { Box, Button } from "@mui/material";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <Box className="navbar-container">
      <NavLink to="/" className="banner">
        Box King
      </NavLink>
      <Box className="navbar-right">
        <NavLink to="/login" className="navbar-link">
          <Button variant="contained" className="navbar-button login-button">
            Login
          </Button>
        </NavLink>
        <NavLink to="/register" className="navbar-link">
          <Button variant="contained" className="navbar-button register-button">
            Get Started
          </Button>
        </NavLink>
      </Box>
    </Box>
  );
};

export default Navbar;
