// import PropTypes from "prop-types"; // data type checking
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import ApiService from "../services/ApiService";

// Styles
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import TablePagination from "@mui/material/TablePagination";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

// IMPORT LOCAL COMPONENTS
import EnhancedToolbar from "./dynamicList/EnhancedToolbar";
import QueryFilter from "./dynamicList/QueryFilter";
import EnhancedTableHead from "./dynamicList/EnhanceTableHead";
import EnhancedTableBody from "./dynamicList/EnhancedTableBody";
import TablePaginationActions from "./dynamicList/EnhancedTablePagination";
import Utils from "./dynamicList/Utils";

const DynamicList = () => {
  const { tableName } = useParams();
  const [searchParams] = useSearchParams();
  const [sysparmQuery, setsysparmQuery] = useState(
    searchParams.get("sysparm_query")
  );
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("sys_updated_on");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Start of useEffect !");
    console.log(
      "dyn list - usereffect - search params : %o\nquery : %s\ntablename : %s",
      searchParams,
      sysparmQuery,
      tableName
    );

    const getData = async () => {
      try {
        const cols = await ApiService.getColumns(tableName);
        const resp = await ApiService.getData({
          table_name: tableName,
          sysparm_query: sysparmQuery,
        });

        setColumns(cols.data.rows);
        setData(resp.data);
        setLoading(false);
      } catch (error) {
        console.log("Error in DynamicList: ", error);
        setLoading(false);
      }
    };

    getData();

    return () => {
      console.log("unmounting useffect");
    };
    // eslint-disable-next-line
  }, [tableName]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = columns.map((n) => n.sys_id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      Utils.stableSort(data, Utils.getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, data]
  );

  return (
    <>
      {isLoading ? (
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
      ) : (
        <Box sx={{ width: "100%" }}>
          <Paper sx={{ width: "100%", mb: 2, overflow: "hidden" }}>
            <EnhancedToolbar
              numSelected={selected.length}
              tableName={tableName}
            />
            <QueryFilter />
            <TableContainer
              component={Paper}
              elevation={1}
              sx={{ overflow: "auto" }}
            >
              <Table
                stickyHeader
                aria-label="sticky table"
                sx={{ minWidth: 750 }}
                size={dense ? "small" : "medium"}
              >
                <EnhancedTableHead
                  columns={columns}
                  visibleRows={visibleRows}
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={columns.length}
                />
                <EnhancedTableBody
                  columns={columns}
                  visibleRows={visibleRows}
                  isSelected={isSelected}
                  handleClick={handleClick}
                  emptyRows={emptyRows}
                  dense={dense}
                  tableName={tableName}
                />
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50, 100]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </Paper>
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
          />
        </Box>
      )}
    </>
  );
};

export default DynamicList;
