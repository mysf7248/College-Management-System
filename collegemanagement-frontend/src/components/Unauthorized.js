import React from "react";
import { Link } from "react-router-dom";
const Unauthorized = () => (
  <div style={{ textAlign: "center", margin: "2rem" }}>
    <h2>Unauthorized</h2>
    <p>You do not have access to this page.</p>
    <Link to="/">Go to Home</Link>
  </div>
);
export default Unauthorized;