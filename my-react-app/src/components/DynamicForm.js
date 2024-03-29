import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import ApiService from "../services/ApiService";

// Styles
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
// import Paper from "@mui/material/Paper";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Stack from "@mui/material/Stack";
// import Input from "@mui/material/Input";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
// import InputAdornment from "@mui/material/InputAdornment";
// import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
// import Radio from "@mui/material/Radio";
// import RadioGroup from "@mui/material/RadioGroup";
// import Autocomplete from "@mui/material/Autocomplete";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
// import LinearProgress from "@mui/material/LinearProgress";

import { styled } from "@mui/system";
// import SaveIcon from "@mui/icons-material/Save";
// import DeleteIcon from "@mui/icons-material/Delete";

const StyledAppBar = styled(AppBar)({
  marginBottom: "1em",
});

const DynamicForm = () => {
  const navigate = useNavigate();
  const { tableName } = useParams();
  const [searchParams] = useSearchParams();
  const [sysID, setSysID] = useState(searchParams.get("sys_id"));
  const [columns, setColumns] = useState([]);
  const [formData, setFormData] = useState({});
  const [pageTitle, setPageTitle] = useState("");
  const [reloadData, setReloadData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkboxes, setCheckboxes] = useState({});

  useEffect(() => {
    // Use useEffect to reset the state variable after the component has re-rendered

    loadForm();

    console.log("in use effect  : %o ", columns);

    if (reloadData) setReloadData(false); // if page has reloaded then stop
    return () => {
      // will run on every unmount.
      // console.log("component is unmounting");
    };
    // eslint-disable-next-line
  }, []);

  // // TODO event base form update when data changes at server side
  // function MyComponent() {
  //   const [data, setData] = useState(null);

  //   useEffect(() => {
  //     const source = new EventSource("http://localhost:8080/events");

  //     source.onmessage = (event) => {
  //       // The 'data' property of the event contains the text sent from the server
  //       setData(event.data);
  //     };

  //     // Don't forget to close the connection when the component unmounts
  //     return () => {
  //       source.close();
  //     };
  //   }, []);

  //   return <div>Data from server: {data}</div>;
  // }

  const initCheckBoxes = () => {
    console.log(columns); // Add this line
    const cbs = columns.reduce((acc, item) => {
      console.log("inside reduce");
      if (item.internal_type === "boolean") {
        console.log(" %o : %o", item.element, formData[item.element]);
        acc[item.element] = formData[item.element];
      }
      return acc;
    }, {});

    // Set the checkboxes and loading state after the reduce operation
    setCheckboxes(cbs);
    setLoading(false);
  };

  const loadForm = async () => {
    await getColumns().then(() => {
      if (sysID !== "-1")
        getData().then(() => {
          initCheckBoxes();
        });
    });

    // Set document title
    if (sysID === "-1") {
      setFormData({ sys_id: -1 });
      setPageTitle("New Record");
    } else setPageTitle(formData.sys_name || sysID);
    document.title = `${tableName} -- ${pageTitle}`;
    console.log("sys_name: %o", formData.sys_name);
  };

  const getColumns = async () => {
    // Fetch table columns when the selected table changes
    if (tableName) {
      try {
        const resp = await ApiService.getColumns(tableName);
        setColumns(resp.data.rows);
        console.log("inside getcolumns : %o ", resp.data.rows); // Add this line
        return new Promise((resolve, reject) => {
          resolve(resolve);
          reject(reject);
        });
      } catch (error) {
        console.error("Error fetching table columns:", error);
      }
    }
  };

  const getData = async () => {
    console.log("inside getdata : %o ", columns); // Add this line
    // Fetch table columns when the selected table changes
    if (tableName && sysID) {
      try {
        const resp = await ApiService.getData({
          tableName: tableName,
          sys_id: sysID,
        });
        setFormData(resp.data.pop());
        return new Promise((resolve, reject) => {
          resolve(resolve);
          reject(reject);
        });
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

  const insertAndStay = async (event) => {
    event.preventDefault();
    var fd = formData;
    fd.sys_id = "-1";
    fd.sys_created_on =
      fd.sys_created_by =
      fd.sys_updated_on =
      fd.sys_updated_by =
      fd.sys_name =
        "";

    setFormData(fd);

    console.log("formdata : %o", formData);

    // return;
    try {
      // Send a request to your API to insert a new row

      const response = await ApiService.addData(tableName, formData);
      console.log("sent data - response :  %o", response);
      if (response.status === "success") {
        console.log("inside if ...");
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
        <Button type="submit" variant="contained" disableElevation size="large">
          Save
        </Button>
        <Button
          type="button"
          variant="contained"
          // color="secondary"
          disableElevation
          size="large"
          onClick={insertAndStay}
        >
          Insert and stay
        </Button>
        <Button
          type="button"
          variant="contained"
          color="error"
          disableElevation
          size="large"
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
            {pageTitle}
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

  const formContainer = (c) => {
    return (
      <Grid container spacing={2} direction="row">
        {/* {(() => {
          switch (c.internal_type) {
            case "boolean":
              return checkbox(c);
            case "string":
              return inputLabel(c), textField(c);
            default:
              return <p>Loading...</p>;
          }
        })()} */}

        {/* {c.internal_type !== "boolean" ? inputLabel(c) : ""} */}
        {/* {c.internal_type !== "boolean" ? textField(c) : ""} */}
        {c.internal_type === "boolean" ? checkbox(c) : textField(c)}
      </Grid>
    );
  };

  // const inputLabel = (c) => {
  //   return (
  //     <Grid item>
  //       <InputLabel sx={{ width: "150", textAlign: "left" }}>
  //         {c.column_label} <br></br>| {c.element}
  //       </InputLabel>
  //     </Grid>
  //   );
  // };

  const textField = (c) => {
    return (
      <Grid item>
        <TextField
          // sx={{ width: 380, left: 150 }}
          label={`${c.column_label} | ${c.element}`}
          sx={{
            width: 380,
            textAlign: "left",
            "& label.Mui-focused": {
              color: "tomato",
            },
            "& .MuiInput-underline:after": {
              borderBottomColor: "tomato",
            },
          }}
          id={`standard-adornment-${c.sys_id}`}
          name={c.element}
          // disabled={c.startsWith("sys_")}
          variant={isSysColumn(c.element) ? "filled" : FormControl.variant}
          inputProps={{
            // Set the readOnly attribute to true
            readOnly: isSysColumn(c.element),
          }}
          value={formData[c.element] || ""}
          onChange={(e) => handleInputChange(c.element, e.target.value)}
          // startAdornment={
          //   <InputAdornment position="start">
          //     {c.internal_type}
          //   </InputAdornment>
          // }
        />
      </Grid>
    );
  };

  const handleCbChange = (event) => {
    setCheckboxes({ ...checkboxes, [event.target.name]: event.target.checked });
  };

  const checkbox = (c) => {
    console.log("checkbox value : %s -- %s", c.element, checkboxes[c.element]);
    return (
      <Grid item>
        <FormControlLabel
          required={c.mandatory === 1 || false}
          control={
            <Checkbox
              name={c.element}
              checked={
                checkboxes[c.element] !== -1
                  ? // eslint-disable-next-line
                    checkboxes[c.element] === true
                  : c.default_value === "true"
              }
              disabled={false}
              size="large"
              onChange={handleCbChange}
            />
          }
          label={c.column_label}
        />
      </Grid>
    );
  };

  if (loading) {
    return (
      <Box>
        <CircularProgress name="progressBar" title="progressBar" />
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            display: "inline-block",
            left: "10px",
            position: "relative",
            top: "-12px",
          }}
        >
          Loading ...
        </Typography>
      </Box>
    ); // Or any other loading indicator
  }

  return (
    <Box component="form" autoComplete="off" onSubmit={handleSubmit}>
      {listHeader(tableName)}
      {columns.map((c, i) => (
        <FormControl
          // help={console.log("c %i:  %o", i, c)}
          fullWidth
          sx={{ m: 1, maxWidth: "45%" }}
          variant="outlined"
        >
          {formContainer(c)}
        </FormControl>
      ))}
      <Box sx={{ marginTop: "30px" }}>{renderButtons()}</Box>
    </Box>
  );
};

export default DynamicForm;
