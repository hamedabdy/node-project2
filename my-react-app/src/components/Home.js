import React, { useState } from "react";
// import { Link } from "react-router-dom";

// import DynamicList from "./DynamicList";
// import DynamicForm from "./DynamicForm";

import TableList from "./TableList";
import {
  Container,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  Grid,
  // Drawer,
  // List,
  // ListItem,
  // ListItemText,
  // Box,
} from "@mui/material";

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Header Menu</Typography>
      </Toolbar>
    </AppBar>
  );
};

// const MainContent = ({ content }) => {
//   return (
//     <Paper elevation={4} style={{ padding: "20px" }}>
//       <Typography variant="h5">Main Content</Typography>
//       {/* <DynamicList /> */}
//     </Paper>
//   );
// };

const Home = () => {
  // const [content, setContent] = useState("Default Content");

  return (
    <div className="layout">
      <section className="header">
        <Header />
        <section>
          <TableList />
        </section>
      </section>
      <main>{/* <MainContent /> */}</main>
    </div>
  );
};

export default Home;
