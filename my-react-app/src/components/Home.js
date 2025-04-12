// import React, { Suspense, Loader } from "react";
// import { Link } from "react-router-dom";

// import DynamicList from "./DynamicList";
// import DynamicForm from "./DynamicForm";

import TableList from "./TableList";
import {} from "@mui/material";

const Home = () => {
  return (
    <div className="layout">
      <section className="header">
        <section>
          <TableList />
        </section>
      </section>
    </div>
  );
};

export default Home;
