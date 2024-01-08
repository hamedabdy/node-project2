// components/TableList.js
import React, { useState, useEffect } from "react";
import ApiService from "../services/ApiService";
import { Link } from "react-router-dom";

const TableList = () => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const data = await ApiService.getTables();
        setTables(data);
      } catch (error) {
        // Handle error
      }
    };

    fetchTables();
  }, []);

  return (
    <div>
      <h2>List of Tables</h2>
      <ol>
        {tables.map((o, i) => (
          <li key={i}>
            <Link to={`/list/${o.table_name}`}>
              {o.table_name} | {o.table_type}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default TableList;
