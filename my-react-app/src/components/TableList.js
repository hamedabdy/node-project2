// components/TableList.js
import React, { useState, useEffect } from "react";
import ApiService from "../services/ApiService";
// import { Link } from "react-router-dom";

import {
  Drawer,
  List,
  ListItemText,
  ListSubheader,
  ListItemButton,
} from "@mui/material";

const TableList = () => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const data = await ApiService.getTables();
        setTables(data);
      } catch (error) {
        // Handle error
      }
    };
    fetchTables();
  }, []);

  return (
    <Drawer variant="permanent" anchor="left">
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Nested List Items
          </ListSubheader>
        }
      >
        {tables.map((o) => (
          <ListItemButton to={`/list/${o.tableName}`}>
            <ListItemText primary={o.tableName} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default TableList;
