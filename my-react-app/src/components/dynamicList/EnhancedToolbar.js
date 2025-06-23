import PropTypes from "prop-types"; // data type checking
import { useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";

import ToolbarActions from "./ToolbarActions";

// Styles
import { alpha } from "@mui/material/styles";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import MenuIcon from '@mui/icons-material/Menu';

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";

const EnhancedToolbar = (props) => {
  const { numSelected, tableName, table } = props;

  const [toolbarSearchValue, settoolbarSearchValue] = useState("");
  const [toolbarSearchField, setToolbarSearchField] = useState("name");

  function ToolbarSearch() {
    return (
      <Box sx={{ marginLeft: 3}}>
        <FormControl sx={{ minWidth: 120 }}>
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
            sx={{ width: 250 }}
            id="toolbar-search-input"
            size="small"
            value={toolbarSearchValue}
            autoComplete="true"
          ></TextField>
        </FormControl>
      </Box>
    );
  }

  return (
    <AppBar
      elevation={2}
      color="default"
      sx={{ position: "relative", zIndex: 100, padding: 1}}
    >
      <Toolbar
        sx={{
          pl: { sm: 1 },
          pr: { sm: 1 },
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
            <Tooltip aria-label="Go back">
              <IconButton
                component={ReactRouterLink}
                to={"../"}
                sx={{
                  backgroundColor: "#E9E9E9", // light grey
                  borderRadius: 0.5, // squared corners (4px)
                  "&:hover": {
                    backgroundColor: "#e0e0e0", // slightly darker on hover
                  },
                  boxShadow: "none",
                  padding: 0.5,
                }}
              >
                <ArrowLeftIcon fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip aria-label="Menu">
              <IconButton
                component={ReactRouterLink}
                to={"#"}
                sx={{
                  marginLeft: 1,
                  backgroundColor: "#E9E9E9", // light grey
                  borderRadius: 0.5, // squared corners (4px)
                  "&:hover": {
                    backgroundColor: "#e0e0e0", // slightly darker on hover
                  },
                  boxShadow: "none",
                  padding: 0.5,
                }}
              >
                <MenuIcon fontSize="large" />
              </IconButton>
            </Tooltip>
            <Typography
              sx={{
                // flex: "0.2 1 50%",
                fontWeight: "bold",
                textTransform: "capitalize",
                marginLeft: 1
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

        {/* Actions moved to ToolbarActions */}
        <ToolbarActions tableName={tableName} numSelected={numSelected} />
      </Toolbar>
    </AppBar>
  );
};

EnhancedToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  tableName: PropTypes.string.isRequired,
};

export default EnhancedToolbar;
