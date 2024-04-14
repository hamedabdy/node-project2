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
import { Paper } from "@mui/material";
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
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    console.log("Start of useEffet !");
    // Use useEffect to reset the state variable after the component has re-rendered

    const loadPage = async () => {
      try {
        if (tableName) {
          const cols = await ApiService.getColumns(tableName);
          setColumns(cols.data.rows);

          if (sysID && sysID !== "-1") {
            const resp = await ApiService.getData({
              tableName: tableName,
              sys_id: sysID,
            });
            setFormData(resp.data.pop());
          }
          setLoading(false);
        }
        // console.log("inside getcolumns : %o ", resp.data.rows); // Add this line
      } catch (error) {
        console.error("Error loading page:", error);
      }
    };

    loadPage();

    // loadForm();

    if (reloadData) setReloadData(false); // if page has reloaded then stop
    return () => {
      // will run on every unmount.
      // console.log("component is unmounting");
    };
    // eslint-disable-next-line
  }, [tableName, sysID]);

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

  // const initCheckBoxes = () => {
  //   console.log(columns); // Add this line
  //   const cbs = columns.reduce((acc, item) => {
  //     console.log("inside reduce");
  //     if (item.internal_type === "boolean") {
  //       console.log(" %o : %o", item.element, formData[item.element]);
  //       acc[item.element] = formData[item.element];
  //     }
  //     return acc;
  //   }, {});

  //   // Set the checkboxes and loading state after the reduce operation
  //   setCheckboxes(cbs);
  //   setLoading(false);
  // };

  // const loadForm = async () => {
  //   await getColumns().then(() => {
  //     if (sysID !== "-1")
  //       getData().then(() => {
  //         initCheckBoxes();
  //       });
  //   });

  //   // Set document title
  //   if (sysID === "-1") {
  //     setFormData({ sys_id: -1 });
  //     setPageTitle("New Record");
  //   } else setPageTitle(formData.sys_name || sysID);
  //   document.title = `${tableName} -- ${pageTitle}`;
  //   console.log("sys_name: %o", formData.sys_name);
  // };

  // const getColumns = async () => {
  //   // Fetch table columns when the selected table changes
  //   if (tableName) {
  //     try {
  //       const resp = await ApiService.getColumns(tableName);
  //       setColumns(resp.data.rows);
  //       console.log("inside getcolumns : %o ", resp.data.rows); // Add this line
  //       return new Promise((resolve, reject) => {
  //         resolve(resolve);
  //         reject(reject);
  //       });
  //     } catch (error) {
  //       console.error("Error fetching table columns:", error);
  //     }
  //   }
  // };

  // const getData = async () => {
  //   // console.log("inside getdata : %o ", columns); // Add this line
  //   // Fetch table columns when the selected table changes
  //   if (tableName && sysID) {
  //     try {
  //       const resp = await ApiService.getData({
  //         tableName: tableName,
  //         sys_id: sysID,
  //       });
  //       setFormData(resp.data.pop());
  //       return new Promise((resolve, reject) => {
  //         resolve(resolve);
  //         reject(reject);
  //       });
  //     } catch (error) {
  //       console.error("Error fetching table columns:", error);
  //     }
  //   }
  // };

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
        <Button type="submit" variant="contained" disableElevation size="small">
          Save
        </Button>
        <Button
          type="button"
          variant="contained"
          // color="secondary"
          disableElevation
          size="small"
          onClick={insertAndStay}
        >
          Insert and stay
        </Button>
        <Button
          type="button"
          variant="contained"
          color="error"
          disableElevation
          size="small"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Stack>
    );
  };

  const BreadCrumbs = (props) => {
    const { tableName } = props;
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
          href={`/${tableName}.list`}
        >
          {tableName}s
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

  const PageHeader = (props) => {
    const { tableName } = props;
    return (
      <Paper elevation={1}>
        <StyledAppBar position="static" color="default" elevation={1}>
          <Toolbar>
            <Typography
              variant="h7"
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
        </StyledAppBar>
        <BreadCrumbs tableName={tableName} />
      </Paper>
    );
  };

  const isSysColumn = (column) => {
    return column.startsWith("sys_");
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

  const EnhancedTextField = (props) => {
    const { c, formData, handleInputChange } = props;
    return (
      <Grid container alignItems="center">
        <Grid item xs={4} key={`grid-label-${c.sys_id}`}>
          <Typography>{c.column_label}</Typography>
        </Grid>
        <Grid item xs={6} key={`grid-field-${c.sys_id}`}>
          <FormControl fullWidth variant="outlined">
            <TextField
              fullWidth
              // label={`${c.column_label} | ${c.element}`}
              sx={{
                "& label.Mui-focused": {
                  color: "tomato",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "tomato",
                },
              }}
              id={`form-textfield-${c.sys_id}`}
              name={c.element}
              variant={isSysColumn(c.element) ? "filled" : FormControl.variant}
              // inputProps={{
              //   // Set the readOnly attribute to true
              //   readOnly: isSysColumn(c.element),
              // }}
              value={formData[c.element] || ""}
              onChange={(e) => handleInputChange(c.element, e.target.value)}
              size="small"
            />
          </FormControl>
        </Grid>
      </Grid>
    );
  };

  const handleCbChange = (event) => {
    setCheckboxes({ ...checkboxes, [event.target.name]: event.target.checked });
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const EnhancedCheckBox = (props) => {
    const { c, isSelected, handleCheckboxClick } = props;
    const isBoxChecked = isSelected(c.element);
    return (
      <Grid container alignItems="center">
        <Grid item xs={4} key={`grid-checkbox-label-${c.sys_id}`}>
          <Typography key={`checkbox-label-${c.element}`}>
            {c.column_label}
          </Typography>
        </Grid>
        <Grid item xs={8} key={`grid-checkbox-${c.sys_id}`}>
          <FormControlLabel
            required={c.mandatory === 1 || false}
            control={
              <Checkbox
                name={c.element}
                checked={isBoxChecked}
                // checked={
                //   checkboxes[c.element] !== -1
                //     ? // eslint-disable-next-line
                //       checkboxes[c.element] === true
                //     : c.default_value === "true"
                // }
                // disabled={false}
                size="medium"
                onChange={handleCheckboxClick}
                key={`checkbox-${c.sys_id}`}
              />
            }
            // label={c.column_label}
          />
        </Grid>
      </Grid>
    );
  };

  // if (loading) {
  //   return (
  //     <Box>
  //       <CircularProgress name="progressBar" title="progressBar" />
  //       <Typography
  //         variant="h6"
  //         sx={{
  //           flexGrow: 1,
  //           display: "inline-block",
  //           left: "10px",
  //           position: "relative",
  //           top: "-12px",
  //         }}
  //       >
  //         Loading ...
  //       </Typography>
  //     </Box>
  //   ); // Or any other loading indicator
  // }

  return (
    <>
      {loading ? (
        <Box>
          <CircularProgress
            name="progressBar"
            title="progressBar"
            key={"progress-circular"}
          />
          <Typography
            key={"page-isloading"}
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
      ) : (
        <Paper elevation={0}>
          <PageHeader tableName={tableName} />
          <Box
            key={"box-form"}
            component="form"
            autoComplete="off"
            onSubmit={handleSubmit}
            sx={{
              m: 1,
              marginTop: 3,
              padding: "0 10%",
              justifyContent: "center",
            }}
          >
            <Grid container spacing={2}>
              {columns.map((c, i) => (
                <Grid item xs={6} key={`grid-form-${i}`}>
                  {c.internal_type === "boolean" ? (
                    <EnhancedCheckBox
                      c={c}
                      isSelected={isSelected}
                      handleCheckboxClick={handleClick}
                      formData={formData}
                    />
                  ) : (
                    <EnhancedTextField
                      c={c}
                      formData={formData}
                      handleInputChange={handleInputChange}
                    />
                  )}
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box sx={{ marginTop: "30px" }} key={"box-buttons-bottom"}>
            {renderButtons()}
          </Box>
        </Paper>
      )}
    </>
  );
};

export default DynamicForm;
