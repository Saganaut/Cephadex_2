import "./styles/App.css";
import "./styles/output.css";

import { ContextWrapper } from "@contexts/ContextWrapper";
import React, { type ReactElement } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { AppRoutes } from "./routes/AppRoutes";

const App = (): ReactElement => {
  return (
    <ContextWrapper>
      <Router>
        <AppRoutes />
      </Router>
    </ContextWrapper>
  );
};

export { App };
