import { useUser } from "@contexts/UserContext";
import React, { type ReactElement } from "react";
import { Route, Routes } from "react-router-dom";

import { privateRoutePaths } from "../routes/PrivateRoutes";
import { publicRoutePaths } from "../routes/PublicRoutes";

const AppRoutes = (): ReactElement => {
  const { user } = useUser();

  const routesToRender = user ? privateRoutePaths : publicRoutePaths;

  return (
    <Routes>
      {routesToRender.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export { AppRoutes };
