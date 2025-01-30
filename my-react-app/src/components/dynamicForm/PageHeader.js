import React, { useState } from "react";

// Styles
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import { Paper } from "@mui/material";

// IMPORT LOCAL COMPONENTS
import FormButtons from "./FormButtons";
import BreadCrumbs from "./BreadCrumbs";

const StyledAppBar = styled(AppBar)({
  marginBottom: "1em",
});

const PageHeader = (props) => {
  const { tableName, insertAndStay, handleDelete } = props;

  const [pageTitle, setPageTitle] = useState("");

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

export default PageHeader;
