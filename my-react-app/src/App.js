import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import DynamicList from "./components/DynamicList";

import {
  // Container,
  // Paper,
  Typography,
  // AppBar,
  // Toolbar,
  // Grid,
  // Drawer,
  // List,
  // ListItem,
  // ListItemText,
  // Box,
} from "@mui/material";

const DynamicForm = lazy(() => import("./components/DynamicForm"));
const TableList = lazy(() => import("./components/TableList"));

function App() {
  useEffect(() => {}, []); // Empty dependency array to ensure the effect runs only once on mount

  return (
    <Router>
      <div>
        <div id="container">
          {/* Content will be dynamically replaced based on the route */}
          <Suspense fallback={<Typography variant="h5">Loading...</Typography>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/table_list" element={<TableList />} />
              <Route path="/:tableName.list" element={<DynamicList />} />
              <Route path="/:tableName.form" element={<DynamicForm />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </Router>
  );
}

export default App;
