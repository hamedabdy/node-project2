import PropTypes from "prop-types"; // data type checking
import React, { useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";

// Styles
import { alpha } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Paper,
  IconButton,
  Tooltip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const EnhancedToolbar = (props) => {
  const { numSelected, tableName, table } = props;

  const [toolbarSearchValue, settoolbarSearchValue] = useState("");
  const [toolbarSearchField, setToolbarSearchField] = useState("name");

  function ToolbarSearch() {
    return (
      <Paper sx={{ marginLeft: 1 }}>
        <FormControl sx={{ minWidth: 100 }}>
          <InputLabel id="toolbar-search-select-autowidth-label">
            Search
          </InputLabel>
          <Select
            labelId="toolbar-search-select-autowidth-label"
            id="toolbar-search-select-autowidth"
            value={toolbarSearchField}
            // onChange={handleChange}
            autoWidth
            label="Search"
            size="small"
            variant="outlined"
            name="toolbar-search-select-autowidth"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"name"}>Name</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <TextField
            label="Search"
            sx={{ width: 100 }}
            id="toolbar-search-input"
            size="small"
            value={toolbarSearchValue}
            autoComplete="true"
          ></TextField>
        </FormControl>
      </Paper>
    );
  }

  return (
    <AppBar
      elevation={1}
      color="default"
      sx={{ position: "relative", zIndex: "100" }}
    >
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <>
            <Tooltip
              aria-label="Go back"
              sx={{
                ...{
                  bgcolor: (theme) =>
                    alpha(
                      theme.palette.primary.main,
                      theme.palette.action.activatedOpacity
                    ),
                },
              }}
            >
              <IconButton
                component={ReactRouterLink}
                to={`/`}
                color="inherit"
                edge="start"
              >
                <ArrowLeftIcon fontSize="large" />
              </IconButton>
            </Tooltip>
            <Typography
              sx={{
                // flex: "0.2 1 50%",
                fontWeight: "bold",
                textTransform: "capitalize",
              }}
              variant="h7"
              id="tableTitle"
              component="div"
              aria-label={tableName}
            >
              {table.label}
            </Typography>
            <ToolbarSearch />
            <Typography
              sx={{
                flex: "1 1 30%",
                fontWeight: "bold",
                textTransform: "capitalize",
              }}
              variant="h7"
              id="tableTitle"
              component="div"
            ></Typography>
          </>
        )}

        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <>
            {/* Add your dropdown list here */}
            <Button variant="contained" href={`/${tableName}.form?sys_id=-1`}>
              New
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

EnhancedToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  tableName: PropTypes.string.isRequired,
};

export default EnhancedToolbar;
