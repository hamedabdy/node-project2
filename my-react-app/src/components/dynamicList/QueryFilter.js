import React, { useState } from "react";

// Styles
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const QueryFilter = (props) => {
  const {} = props;

  const [showFilterQuery, setShowFilterQuery] = useState(false);

  const filterListIconClick = () => {
    setShowFilterQuery(!showFilterQuery);
  };

  return (
    <Paper>
      <Grid container>
        <Paper>
          <Tooltip title="Filter list">
            <IconButton onClick={filterListIconClick}>
              <FilterAltOutlinedIcon color="primary" />
            </IconButton>
          </Tooltip>
          {"queryValue"}
        </Paper>
      </Grid>
      <Grid container sx={{ display: showFilterQuery ? "grid" : "none" }}>
        <Paper>
          <Button variant="outlined" label="Run filter">
            Run filter
          </Button>
        </Paper>
        <Paper>
          <TextField label="Field" size="small" />
          <TextField label="Operator" size="small" />
          <TextField label="Value" size="small" />
          <Button variant="outlined" label="OR">
            OR
          </Button>
          <Button variant="outlined" label="AND">
            AND
          </Button>
          <Tooltip title="Remove condition">
            <IconButton onClick={filterListIconClick}>
              <RemoveCircleOutlineIcon />
            </IconButton>
          </Tooltip>
        </Paper>
      </Grid>
    </Paper>
  );
};

export default QueryFilter;
