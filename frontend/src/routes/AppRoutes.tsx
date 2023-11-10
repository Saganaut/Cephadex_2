// import { useUser } from "@contexts/UserContext";
import React, { type ReactElement } from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Route, Routes } from "react-router-dom";
import { useAppDispatch } from "@store/hooks";
import { fetchUserThunk } from "@services/Api/User/UserApiThunks";
import { fetchUserSettingsThunk } from "@services/Api/User/UserApiThunks";
import { privateRoutePaths } from "@routes/PrivateRoutes";
import { publicRoutePaths } from "@routes/PublicRoutes";
import { checkUserAuth } from "@services/CheckUserAuth";
import { logger } from "@utils/Logger";

const AppRoutes = (): ReactElement => {
  const dispatch = useAppDispatch();
  const user = useSelector((state) => state.user); // Assuming state.user holds the user's information

  useEffect(() => {
    const verifyAuth = async () => {
      const userAuthStatus = await checkUserAuth();
      if (userAuthStatus) {
        dispatch(fetchUserThunk());
        dispatch(fetchUserSettingsThunk());
      } else {
        logger.warn("not authenticated");
      }
    };

    verifyAuth();
  }, [dispatch]);

  const routesToRender = user.user ? privateRoutePaths : publicRoutePaths;

  return (
    <Routes>
      {routesToRender.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export { AppRoutes };
