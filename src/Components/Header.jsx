import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { NavLink } from "react-router-dom";
import './Header.css';

const Header = (props) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          ></IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Cricket Commentary
          </Typography>
          <NavLink
            className="nav-link"
            to="/"
            exact
          >
            Live
          </NavLink>
          <NavLink
            className="nav-link"
            to="/Create"
            exact
          >
            Commentator's Section
          </NavLink>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
export default Header;
