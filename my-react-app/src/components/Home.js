import React, { useState } from "react";
import TableList from "./TableList";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";

const Home = () => {
  const [iframeSrc, setIframeSrc] = useState("");
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const handleTableSelect = (url) => {
    setIframeSrc(url);
  };

  const handleAllClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <Box style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Top Navigation Bar */}
      <AppBar position="static" style={{ width: "100vw" }}>
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <img
              src="/path/to/logo.png"
              alt="Company Logo"
              style={{ height: "40px" }}
            />
            <IconButton color="inherit" onClick={handleAllClick}>
              All
            </IconButton>
            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <TableList onTableSelect={handleTableSelect} />
            </Menu>
          </Box>
          <Box>
            <IconButton color="inherit">
              <AccountCircleIcon />
            </IconButton>
            <IconButton color="inherit">
              <SettingsIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      {iframeSrc && (
        <Box style={{ flex: 1, border: "1px solid #ccc" }}>
          <iframe
            src={iframeSrc}
            title="Table Content"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </Box>
      )}
    </Box>
  );
};

export default Home;
