import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import ApiService from "../services/ApiService";

// Styles
import { styled } from "@mui/system";

// import SaveIcon from "@mui/icons-material/Save";
// import DeleteIcon from "@mui/icons-material/Delete";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Link,
  // Paper,
  Breadcrumbs,
  Stack,
  // Input,
  Grid,
  FormControl,
  // InputAdornment,
  InputLabel,
  Box,
  TextField,
} from "@mui/material";

const StyledAppBar = styled(AppBar)({
  marginBottom: "1em",
});

const DynamicForm = () => {
  const navigate = useNavigate();
  const { tableName } = useParams();

  // console.log("tablename : %s", tableName);
  const [searchParams] = useSearchParams();
  const [sysID, setSysID] = useState(searchParams.get("sys_id"));
  // const [resp, setRes] = useState({});
  const [columns, setColumns] = useState([]);
  const [formData, setFormData] = useState({});
  const [reloadData, setReloadData] = useState(false);

  useEffect(() => {
    // Use useEffect to reset the state variable after the component has re-rendered
    if (reloadData) setReloadData(false); // if page has reloaded then stop

    getColumns();
    if (sysID !== "-1") getData();

    // Set document title
    document.title = tableName;
    if (sysID === "-1") {
      setFormData({ sys_id: -1 });
      document.title += " -- New Record";
    } else document.title += " -- " + (formData.sys_id || sysID);

    return () => {
      // will run on every unmount.
      console.log("component is unmounting");
    };
    // eslint-disable-next-line
  }, [reloadData]);

  //
  const getColumns = async () => {
    // Fetch table columns when the selected table changes
    if (tableName) {
      try {
        const resp = await ApiService.getColumns(tableName);
        // setRes(resp);
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
        // After saving the form, update the state to trigger a re-render
        setReloadData(true);
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
        // After saving the form, update the state to trigger a re-render
        setReloadData(true);
      }
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  // Form top and bottom buttons
  const renderButtons = (direction) => {
    const dir = !direction ? "row" : direction;
    return (
      <Stack direction={dir} spacing={2}>
        <Button type="submit" variant="contained">
          Save
        </Button>
        <Button
          type="button"
          variant="contained"
          color="error"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Stack>
    );
  };

  const breadCrumbs = (list) => {
    return (
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/">
          Home
        </Link>
        <Link
          color="inherit"
          sx={{
            textTransform: "capitalize",
          }}
          href={`/${list}.list`}
        >
          {list}s
        </Link>
        <Typography
          sx={{
            fontWeight: "bold",
          }}
          color="textPrimary"
        >
          Current page
        </Typography>
      </Breadcrumbs>
    );
  };

  const listHeader = (tableName) => {
    return (
      <StyledAppBar position="static" color="default">
        <Toolbar>
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          >
            {tableName}s
          </Typography>
          <Typography variant="h8" sx={{ flexGrow: 1 }}>
            {sysID === "-1" ? "New Record" : `${formData.sys_id}`}
          </Typography>
          {renderButtons()}
        </Toolbar>
        <Typography variant="h7" sx={{ flexGrow: 1, marginLeft: "10px" }}>
          {breadCrumbs(tableName)}
        </Typography>
      </StyledAppBar>
    );
  };

  const isSysColumn = (column) => {
    return column.startsWith("sys_");
  };

  return (
    <Box component="form" autoComplete="off" onSubmit={handleSubmit}>
      {listHeader(tableName)}
      {columns.map((column, i) => (
        <FormControl
          // help={console.log("column %i:  %s", i, column)}
          fullWidth
          sx={{ m: 1, maxWidth: "45%" }}
          variant="outlined"
        >
          <Grid container spacing={2} direction="row">
            <Grid item>
              <InputLabel sx={{ width: "150", textAlign: "left" }}>
                {column}
              </InputLabel>
            </Grid>
            <Grid item>
              <TextField
                sx={{ width: 380, left: 150 }}
                id={`standard-adornment-${column}`}
                // disabled={column.startsWith("sys_")}
                variant={isSysColumn(column) ? "filled" : FormControl.variant}
                inputProps={{
                  // Set the readOnly attribute to true
                  readOnly: isSysColumn(column),
                }}
                value={formData[column] || ""}
                onChange={(e) => handleInputChange(column, e.target.value)}
                // startAdornment={
                //   <InputAdornment position="start">
                //     {resp.data[column].type}
                //   </InputAdornment>
                // }
              />
            </Grid>
          </Grid>
        </FormControl>
      ))}
      <Box sx={{ marginTop: "30px" }}>{renderButtons()}</Box>
    </Box>
  );
};

export default DynamicForm;
