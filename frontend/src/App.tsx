import "./styles/App.css";
import "./styles/output.css";

import { ContextWrapper } from "@contexts/ContextWrapper";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { AppRoutes } from "./routes/AppRoutes";

const App = () => {
  return (
    <ContextWrapper>
      <Router>
        <AppRoutes />
      </Router>
    </ContextWrapper>
  );
};

export { App };
