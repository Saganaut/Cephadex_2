import { AppRoutes } from "@routes/AppRoutes";
import { ContextWrapper } from "@source/lib/contexts/ContextWrapper";
import React, { type ReactElement } from "react";
import { BrowserRouter as Router } from "react-router-dom";

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
