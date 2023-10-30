import "styles/App.css";
import React from "react";
import "styles/output.css";
import { AppRoutes } from "routes/AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";

import { ContextWrapper } from 'contexts/ContextWrapper';

const App = () => {
  return (
    <ContextWrapper >
    
      <Router>
        <AppRoutes />
      </Router>
  </ContextWrapper>
  );
};

export { App };
