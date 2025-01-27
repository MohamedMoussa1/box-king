import "./Navbar.css";
import { Box } from "@mui/material";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <Box className="navbar-container">
      <NavLink to="/" className="banner-button">
        Box King
      </NavLink>
    </Box>
  );
};

export default Navbar;
