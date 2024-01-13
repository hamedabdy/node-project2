import React, { useState, useEffect, lazy } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import ApiService from "../services/ApiService";

// Styles
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  // Link,
  // Paper,
  Stack,
  Input,
  FormControl,
  InputAdornment,
  InputLabel,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";

const StyledAppBar = styled(AppBar)({
  marginBottom: "1em",
});

const DynamicForm = () => {
  const navigate = useNavigate();
  const { tableName } = useParams();
  const [searchParams] = useSearchParams();
  const [sysID, setSysID] = useState(searchParams.get("sys_id"));
  const [resp, setRes] = useState({});
  const [columns, setColumns] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    getColumns();
    if (sysID !== "-1") getData();

    // Set document title
    document.title = tableName;
    if (sysID === "-1") document.title += " -- New Record";
    else document.title += " -- " + formData.name;

    // eslint-disable-next-line
  }, [tableName, sysID]);

  //
  const getColumns = async () => {
    // Fetch table columns when the selected table changes
    if (tableName) {
      try {
        const resp = await ApiService.getColumns(tableName);
        setRes(resp);
        setColumns(Object.keys(resp.data));
      } catch (error) {
        console.error("Error fetching table columns:", error);
      }
    }
  };

  const getData = async () => {
    // Fetch table columns when the selected table changes
    if (tableName && sysID) {
      try {
        const resp = await ApiService.getData({
          tableName: tableName,
          sys_id: sysID,
        });
        setFormData(resp.data.pop());
      } catch (error) {
        console.error("Error fetching table columns:", error);
      }
    }
  };

  const handleInputChange = (columnName, value) => {
    // Update form data when input values change
    setFormData((prevData) => ({
      ...prevData,
      [columnName]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send a request to your API to insert a new row
      const response = await ApiService.addData(tableName, formData);
      if (response.status === "success") {
        setSysID(response.sys_id);
        navigate(`?sys_id=${response.sys_id}`);
      }
    } catch (error) {
      console.error("Error inserting row:", error);
    }
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    try {
      const response = await ApiService.deleteData(tableName, sysID);
      if (response.status === "success") {
        navigate(-1);
      }
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  const listHeader = (tableName) => {
    return (
      <StyledAppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {tableName}
          </Typography>
          <Typography variant="h8" sx={{ flexGrow: 1 }}>
            {sysID === "-1" ? "New Record" : `${formData.sys_id}`}
          </Typography>
          {renderButtons()}
        </Toolbar>
      </StyledAppBar>
    );
  };

  // Form top and bottom buttons
  const renderButtons = (direction) => {
    const dir = !direction ? "row" : direction;
    return (
      <Stack direction={dir} spacing={2}>
        <Button type="submit" variant="contained" endIcon={<SaveIcon />}>
          Save
        </Button>
        <Button
          type="button"
          variant="contained"
          color="error"
          endIcon={<DeleteIcon />}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Stack>
    );
  };

  const renderForm = () => {
    const keys = Object.keys(columns.data);
    return (
      <Box>
        {columns.data.map((column, i) => (
          <Stack key={keys[i]}>
            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
              <InputLabel htmlFor={`standard-adornment-${keys[i]}`}>
                {keys[i]}
              </InputLabel>
              <Input
                id={`standard-adornment-${keys[i]}`}
                value={formData[keys[i]] || ""}
                onChange={(e) => handleInputChange(keys[i], e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    {keys[i].type}
                  </InputAdornment>
                }
              />
            </FormControl>
          </Stack>
        ))}
      </Box>
    );
  };

  // const keys = Object.keys(columns.data);

  return (
    <div>
      {listHeader(tableName)}
      <Box
        component="form"
        sx={{
          "& > :not(style)": {
            m: 1,
            width: "50%",
            p: 2,
          },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        {/* {renderForm()} */}
        {columns.map((column) => (
          <Stack key={column}>
            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
              <InputLabel htmlFor={`standard-adornment-${column}`}>
                {column}
              </InputLabel>
              <Input
                id={`standard-adornment-${column}`}
                value={formData[column] || ""}
                onChange={(e) => handleInputChange(column, e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    {resp.data[column].type}
                  </InputAdornment>
                }
              />
            </FormControl>
          </Stack>
        ))}
        {renderButtons()}
      </Box>
    </div>
  );
};

export default DynamicForm;
