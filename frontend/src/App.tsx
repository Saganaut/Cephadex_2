import { AppRoutes } from "@routes/AppRoutes";
import React, { type ReactElement } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { ContextWrapper } from "./lib/contexts/ContextWrapper";

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
