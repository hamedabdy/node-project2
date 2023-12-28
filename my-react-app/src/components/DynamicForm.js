import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import ApiService from "../services/ApiService";

// Styles
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
// import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
// import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";

const DynamicForm = () => {
  const navigate = useNavigate();
  const { tableName } = useParams();
  const [searchParams] = useSearchParams();
  const [sysID, setSysID] = useState(searchParams.get("sys_id"));
  const [columns, setColumns] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    getColumns();
    if (sysID !== "-1") getData();

    // Set document title
    document.title = tableName;
    if (sysID === "-1") document.title += " -- New Record";
    else document.title += " -- " + formData.PersonID;

    // eslint-disable-next-line
  }, [tableName, sysID]);

  const getColumns = async () => {
    // Fetch table columns when the selected table changes
    if (tableName) {
      try {
        const cols = await ApiService.getColumns(tableName);
        setColumns(cols);
      } catch (error) {
        console.error("Error fetching table columns:", error);
      }
    }
  };

  const getData = async () => {
    // Fetch table columns when the selected table changes
    if (tableName && sysID) {
      try {
        const data = await ApiService.getData({
          tableName: tableName,
          sys_id: sysID,
        });
        setFormData(data.pop());
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
        console.log("Row inserted successfully:");
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
        console.log("Row inserted successfully:");
        navigate(-1);
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
        <Button type="submit" variant="outlined" endIcon={<SaveIcon />}>
          Save
        </Button>
        <Button
          type="button"
          variant="outlined"
          color="error"
          endIcon={<DeleteIcon />}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Stack>
    );
  };

  return (
    <div>
      <h1>{tableName}</h1>
      {sysID === "-1" ? <h4>New Record</h4> : ""}
      <Box
        component="form"
        sx={{
          "& > :not(style)": {
            m: 1,
            width: "45%",
            p: 2,
          },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        {renderButtons("row-reverse")}
        {/* Render input fields dynamically based on table columns */}
        {columns.map((column) => (
          <div key={column.Field}>
            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
              <InputLabel htmlFor={`standard-adornment-${column.Field}`}>
                {column.Field}
              </InputLabel>
              <Input
                id={`standard-adornment-${column.Field}`}
                value={formData[column.Field] || ""}
                onChange={(e) =>
                  handleInputChange(column.Field, e.target.value)
                }
                startAdornment={
                  <InputAdornment position="start">
                    {column.Field_Type}
                  </InputAdornment>
                }
              />
            </FormControl>
          </div>
        ))}
        {renderButtons()}
      </Box>
    </div>
  );
};

export default DynamicForm;
