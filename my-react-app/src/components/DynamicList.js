import React, { useState, useEffect } from "react";
import { useParams, Link as ReactRouterLink } from "react-router-dom";
// import PropTypes from "prop-types"; // data type checking

import ApiService from "../services/ApiService";

// Styles
import {
  AppBar,
  Box,
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
  // Stack,
  // ListSubheader,
  CircularProgress,
  Grid,
  TablePagination,
  TableSortLabel,
  Checkbox,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
// import { styled } from "@mui/system";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const DynamicList = () => {
  const { tableName } = useParams();
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("sys_id");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isLoading, setLoading] = useState(true);
  const [showFilterQuery, setShowFilterQuery] = useState(false);

  useEffect(() => {
    console.log("Start of useEffect !");

    const getData = async () => {
      try {
        const cols = await ApiService.getColumns(tableName);
        const resp = await ApiService.getData({ tableName: tableName });

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
      stableSort(data, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, data]
  );

  const filterListIconClick = () => {
    setShowFilterQuery(!showFilterQuery);
  };

  function EnhancedTableToolbar(props) {
    const { numSelected, tableName } = props;
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
            <Typography
              sx={{
                flex: "1 1 100%",
                fontWeight: "bold",
                textTransform: "capitalize",
              }}
              variant="h5"
              id="tableTitle"
              component="div"
            >
              {tableName}s
            </Typography>
          )}

          {numSelected > 0 ? (
            <Tooltip title="Delete">
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <></>
          )}
          {/* Add your dropdown list here */}
          <Button variant="contained" href={`/${tableName}.form?sys_id=-1`}>
            New
          </Button>
        </Toolbar>
        <Typography variant="h7" sx={{ flexGrow: 1, marginLeft: "10px" }}>
          <BreadCrumbs />
        </Typography>
      </AppBar>
    );
  }

  const QueryFilter = (props) => {
    return (
      <Paper>
        <Grid container>
          <Paper>
            <Tooltip title="Filter list">
              <IconButton onClick={filterListIconClick}>
                <FilterListIcon />
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

  const BreadCrumbs = () => {
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

  function EnhancedTableHead(props) {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      onRequestSort,
    } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all records",
              }}
            />
          </TableCell>
          {columns.map((c) => (
            <TableCell
              key={c.sys_id}
              // align={headCell.numeric ? 'right' : 'left'}
              // padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === c.sys_id ? order : false}
            >
              <TableSortLabel
                active={orderBy === c.sys_id}
                direction={orderBy === c.sys_id ? order : "asc"}
                onClick={createSortHandler(c.sys_id)}
              >
                {c.column_label}
                {orderBy === c.sys_id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  function EnhancedTableBody(props) {
    const { visibleRows, columns, isSelected, handleClick } = props;
    return (
      <TableBody>
        {visibleRows.map((row, index) => {
          const isItemSelected = isSelected(row.sys_id);
          const labelId = `enhanced-table-checkbox-${index}`;
          return (
            <TableRow
              hover
              // onClick={(event) => handleClick(event, row.sys_id)}
              role="checkbox"
              aria-checked={isItemSelected}
              tabIndex={-1}
              selected={isItemSelected}
              sx={{ cursor: "default" }}
              key={row.sys_id}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  onClick={(event) => handleClick(event, row.sys_id)}
                  color="primary"
                  checked={isItemSelected}
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </TableCell>
              {columns.map((c, i) => (
                <React.Fragment>
                  {c.element !== "sys_id" ? (
                    <TableCell key={`${c.element}_${c.sys_id}`}>
                      {row[c.element]}
                    </TableCell>
                  ) : (
                    <TableCell
                      key={`${c.element}_${c.sys_id}`}
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      <Link
                        component={ReactRouterLink}
                        to={`/${tableName}.form?${c.element}=${row[c.element]}`}
                      >
                        {row[c.element]}
                      </Link>
                    </TableCell>
                  )}
                </React.Fragment>
              ))}
            </TableRow>
          );
        })}
        {emptyRows > 0 && (
          <TableRow
            style={{
              height: (dense ? 33 : 53) * emptyRows,
            }}
          >
            <TableCell colSpan={6} />
          </TableRow>
        )}
      </TableBody>
    );
  }

  EnhancedTableBody.propTypes = {
    columns: PropTypes.array.isRequired,
    visibleRows: PropTypes.array.isRequired,
    isSelected: PropTypes.func.isRequired,
    // order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    // orderBy: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired,
  };

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
            <EnhancedTableToolbar
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
                />
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
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
