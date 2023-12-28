import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <Link to="/list/Persons">Persons</Link>
      <br />
      <Link to="/form/Persons?sys_id=-1">Person - New</Link>
    </div>
  );
};

export default Home;
