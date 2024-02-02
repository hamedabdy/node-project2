import React, { useState, useEffect } from "react";
import { useParams, Link as ReactRouterLink } from "react-router-dom";
// import PropTypes from "prop-types"; // data type checking

import ApiService from "../services/ApiService";

// Styles
import {
  AppBar,
  // Box,
  Toolbar,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Stack,
} from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";

const StyledAppBar = styled(AppBar)({
  marginBottom: "1em",
});

const StyledTable = styled(Table)({
  minWidth: 650,
});

const DynamicList = () => {
  const { tableName } = useParams();
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [tableName]);

  const getData = async () => {
    try {
      const cols = await ApiService.getColumns(tableName);
      const resp = await ApiService.getData({ tableName: tableName });
      setColumns(Object.keys(cols.data));
      setData(resp.data);
    } catch (error) {
      console.log("Error in DynamicList: ", error);
    }
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
          {/* Add your dropdown list here */}
          <Button variant="contained" href={`/${tableName}.form?sys_id=-1`}>
            New
          </Button>
        </Toolbar>
        <Typography variant="h7" sx={{ flexGrow: 1, marginLeft: "10px" }}>
          {breadCrumbs()}
        </Typography>
      </StyledAppBar>
    );
  };

  const breadCrumbs = () => {
    return (
      <Breadcrumbs aria-label="breadcrumb">
        {/* Add your breadcrumb items here */}
        <Link color="inherit" href="/">
          Home
        </Link>
        <Typography color="textPrimary">Current page</Typography>
      </Breadcrumbs>
    );
  };

  return (
    <div>
      <Stack>{listHeader(tableName)}</Stack>
      {/* Add your pagination component here */}
      <TableContainer component={Paper} elevation={4}>
        <StyledTable stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column}>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.sys_id}>
                {columns.map((column) => (
                  <TableCell key={column}>
                    {column === "sys_id" ? (
                      <Link
                        component={ReactRouterLink}
                        to={`/${tableName}.form?${column}=${row[column]}`}
                      >
                        {row[column]}
                      </Link>
                    ) : (
                      row[column]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </TableContainer>

      {/* <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.sys_id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box> */}
    </div>
  );
};

export default DynamicList;
