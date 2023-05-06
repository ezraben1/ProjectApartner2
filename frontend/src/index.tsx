import React from "react";
import ReactDOM from "react-dom";
import AppRoutes from "./Routes";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>,
  document.getElementById("root")
);
