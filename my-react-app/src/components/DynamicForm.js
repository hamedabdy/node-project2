import React, {
  useState,
  useEffect,
  useRef,
  startTransition,
  Suspense,
} from "react";
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
import { element } from "prop-types";
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
  const [isLoading, setIsLoading] = useState(true);
  const [checkboxes, setCheckboxes] = useState({});
  const [error, setError] = useState(null);

  const loadPage = async () => {
    console.log("DynForm - function load page !");

    try {
      if (tableName) {
        const cols = await ApiService.getColumns(tableName);
        if (sysID && sysID !== "-1") {
          const resp = await ApiService.getData({
            table_name: tableName,
            sys_id: sysID,
          });

          setColumns(cols.data.rows);
          setFormData(resp.data.pop());
        }
      }
    } catch (error) {
      console.error("Error loading page:", error);
      setError("Failed to fetch record");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("DynForm - Start of useEffet !");
    // Use useEffect to reset the state variable after the component has re-rendered

    loadPage();

    if (reloadData) setReloadData(false); // if page has reloaded then stop
    return () => {
      // will run on every unmount.
      console.log("DynForm - component is unmounting");
    };
    // eslint-disable-next-line
  }, [tableName, sysID, reloadData]);

  // if (isLoading) {
  //   return (
  //     <Box>
  //       {" "}
  //       {console.log("inside loading component !")}
  //       <CircularProgress
  //         name="progressBar"
  //         title="progressBar"
  //         key={"progress-circular"}
  //       />
  //       <Typography
  //         key={"page-isloading"}
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
  //   );
  // }

  // if (error) {
  //   return (
  //     <div>
  //       <p>{error}</p>
  //     </div>
  //   );
  // }

  // TODO event base form update when data changes at server side

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
      // console.log("sent data - response :  %o", response);
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
  const FormButtons = (props) => {
    // const dir = !direction ? "row" : direction;
    const { insertAndStay, handleDelete } = props;
    return (
      <Stack direction="row" spacing={2}>
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
            <FormButtons
              insertAndStay={insertAndStay}
              handleDelete={handleDelete}
            />
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

  function useTraceUpdate(props) {
    const prev = useRef(props);
    useEffect(() => {
      const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
        if (prev.current[k] !== v) {
          ps[k] = [prev.current[k], v];
        }
        return ps;
      }, {});
      if (Object.keys(changedProps).length > 0) {
        console.log("Changed props:", changedProps);
      }
      prev.current = props;
    });
  }

  const EnhancedTextField = (props) => {
    const { c, formData, handleInputChange } = props;
    useTraceUpdate(props);
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

  const handleCheckboxClick = (event, id) => {
    const { name, type, checked } = event.target;

    // Update the checkboxes state
    setCheckboxes((prev) => ({ ...prev, [name]: checked }));

    // Update the formData
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const EnhancedCheckBox = (props) => {
    const { c, handleCheckboxClick, checkboxes, formData } = props;
    // console.log(
    //   "columns : %s : \n%o\n\nformdata : %o\n\n%o",
    //   c.element,
    //   c,
    //   formData[c.element],
    //   formData
    // );

    return (
      <Grid container alignItems="center">
        <Grid item xs={4} key={`grid-checkbox-label-${c.sys_id}`}>
          <Typography key={`checkbox-label-${c.element}`}>
            {c.column_label}
          </Typography>
        </Grid>
        <Grid item xs={8} key={`grid-checkbox-${c.sys_id}`}>
          <FormControlLabel
            required={c.mandatory === 1}
            control={
              <Checkbox
                name={c.element}
                checked={checkboxes[c.element] || formData[c.element] === 1}
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

  return (
    <Paper
      elevation={0}
      component="form"
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <PageHeader tableName={tableName} />
      <Box
        key={"box-form"}
        sx={{
          m: 1,
          marginTop: 3,
          padding: "0 10%",
          justifyContent: "center",
        }}
      >
        <Grid container spacing={2}>
          {columns.map((c) => (
            <Grid item xs={6} key={`grid-input-${c.sys_id}`}>
              {c.internal_type === "boolean" ? (
                <EnhancedCheckBox
                  c={c}
                  handleCheckboxClick={handleCheckboxClick}
                  checkboxes={checkboxes}
                  formData={formData}
                />
              ) : (
                // <EnhancedTextField
                //   c={c}
                //   formData={formData}
                //   handleInputChange={handleInputChange}
                // />
                <Grid container alignItems="center">
                  <Grid item xs={4} key={`grid-label-${c.sys_id}`}>
                    <Typography>
                      {c.column_label} | {c.element}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} key={`grid-field-${c.sys_id}`}>
                    <FormControl fullWidth variant="outlined">
                      <TextField
                        fullWidth
                        // label={`${c.column_label} | ${c.element}`}
                        id={`form-textfield-${c.sys_id}`}
                        name={c.element}
                        variant={
                          isSysColumn(c.element)
                            ? "filled"
                            : FormControl.variant
                        }
                        inputProps={{
                          // Set the readOnly attribute to true
                          readOnly: isSysColumn(c.element),
                        }}
                        value={formData[c.element] || ""}
                        error={error}
                        required={false}
                        helperText={error ? "This field is required" : ""}
                        onChange={(e) => {
                          handleInputChange(c.element, e.target.value);
                          if (e.target.value) setError(false);
                        }}
                        size="small"
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              )}
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ marginTop: "30px" }} key={"box-buttons-bottom"}>
        <FormButtons
          insertAndStay={insertAndStay}
          handleDelete={handleDelete}
        />
      </Box>
    </Paper>
  );
};

export default DynamicForm;
