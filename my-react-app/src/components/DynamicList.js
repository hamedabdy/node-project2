import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import ApiService from "../services/ApiService";

// Styles
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

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
      setColumns(cols);
      setData(resp.data);
    } catch (error) {
      console.log("Error in DynamicList: ", error);
    }
  };

  // Form top and bottom buttons
  const renderButtons = (direction, tableName) => {
    const dir = !direction ? "row" : direction;
    return (
      <Stack direction={dir} spacing={2}>
        <Button variant="outlined" href={`../form/${tableName}?sys_id=-1`}>
          New
        </Button>
      </Stack>
    );
  };

  return (
    <div>
      <span>
        <h1>{tableName}</h1>
      </span>
      <span>{renderButtons("row-reverse", tableName)}</span>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.Field}>{column.Field}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.sys_id}>
                {columns.map((column) => (
                  <TableCell key={column.Field}>
                    {column.Field === "sys_id" ? (
                      <Link
                        to={`../form/${tableName}?${column.Field}=${
                          row[column.Field]
                        }`}
                      >
                        {row[column.Field]}
                      </Link>
                    ) : (
                      row[column.Field]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

export default DynamicList;
