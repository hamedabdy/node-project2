import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import ApiService from "../services/ApiService";

// Styles
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";

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
      const data = await ApiService.getData({ tableName: tableName });
      setColumns(cols);
      setData(data);
    } catch (error) {
      console.log("Error in DynamicList: ", error);
    }
  };

  return (
    <div>
      <h1>{tableName}</h1>
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
                  <TableCell key={column.Field}>{row[column.Field]}</TableCell>
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
