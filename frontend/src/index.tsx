import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import "./styles/output.css";
import { App } from "./App";
// import reportWebVitals from "@source/reportWebVitals";

const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// reportWebVitals();
