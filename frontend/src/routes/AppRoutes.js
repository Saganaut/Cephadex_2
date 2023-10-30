import React from 'react';
import { useUser } from 'contexts/UserContext'; 
import { Routes, Route } from 'react-router-dom';
import {publicRoutePaths}  from 'routes/PublicRoutes';
import {privateRoutePaths} from 'routes/PrivateRoutes';

const AppRoutes = () => {
  const { user } = useUser();

  const routesToRender = user ? privateRoutePaths : publicRoutePaths;

  return (
    <Routes>
      {routesToRender.map((route, index) => (
        <Route 
          key={index}
          path={route.path} 
          element={route.element} 
        />
      ))}
    </Routes>
  );
};

export { AppRoutes } 