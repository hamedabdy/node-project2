import React, { /*useState,*/ useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import DynamicList from "./components/DynamicList";
import DynamicForm from "./components/DynamicForm";
import TableList from "./components/TableList";
// import axios from "axios";
// import MaterialUIExample from "./components/MaterialUIExample";

function App() {
  useEffect(() => {}, []); // Empty dependency array to ensure the effect runs only once on mount

  return (
    <Router>
      <div>
        <div id="container">
          {/* Content will be dynamically replaced based on the route */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/table_list" element={<TableList />} />
            <Route path="/list/:tableName" element={<DynamicList />} />
            <Route path="/form/:tableName" element={<DynamicForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
