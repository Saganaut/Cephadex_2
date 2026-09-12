// import { useUser } from "@contexts/UserContext";
import { privateRoutePaths } from "@routes/PrivateRoutes";
import { publicRoutePaths } from "@routes/PublicRoutes";
import * as Sentry from "@sentry/react";
import { ErrorPage } from "@source/pages/UtilityPages/ErrorPage";
import { LoginPage } from "@source/pages/UtilityPages/LoginPage";
import { UnknownPage } from "@source/pages/UtilityPages/UnknownPage";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { checkUserAuth, refreshToken } from "@store/user/actions";
import React, { type ErrorInfo, type ReactElement } from "react";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { matchPath, Route, Routes, useLocation } from "react-router-dom";

const PAGE_TITLE_MAP: Record<string, string> = {
  // Add index signature
  "/": "Cephadex",
  "/about": "About Us",
  "/contact": "Contact Us",
  "/create-deck": "Create Deck",
  "/deck": "My Decks",
  "/decks": "My Decks",
  "/groups": "My Groups",
  "/quizzes": "My Quizzes",
  "/quiz": "My Quizzes",
  "/group": "My Groups",
  "/study": "Study",
  "/upgrade": "Upgrade",
  "/community": "Community",
  "/game": "Play",
  "/sign-out": "Sign Out",
  "/blog": "Blog",
  "/pricing": "Pricing",
  "/documentation": "Documentation",
  "/legal": "Legal",
  "/terms": "Terms And Conditions",
  "/register": "Register",
  "/logged-out": "Logged Out",
  "/faq": "FAQ",
  "/newsletter": "Newsletter",
  "/tutorials": "Tutorials",
  "/privacy": "Privacy Policy",
};

const usePageTitle = (): void => {
  const defaultTitle = "Cephadex";

  const location = useLocation();
  useEffect(() => {
    document.title = PAGE_TITLE_MAP[location.pathname] ?? defaultTitle;
  }, [location]);
};

const AppRoutes = (): ReactElement => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user); // Assuming state.user holds the user's information

  useEffect(() => {
    const verifyAuth = async (): Promise<void> => {
      void dispatch(checkUserAuth());
      // if (userAuthStatus.loggedIn) {
      //   dispatch(fetchUser());
      //   dispatch(fetchUserSettings());
      //   dispatch(fetchNotifications());
      // } else {
      // }
    };

    void verifyAuth();
  }, [dispatch]);

  useEffect(() => {
    const tokenCheckInterval = setInterval(() => {
      void dispatch(refreshToken());
    }, 3600000); // Check every hour

    return () => {
      clearInterval(tokenCheckInterval);
    };
  }, [dispatch]);

  const isAuthenticated = user.user != null && user.user.guest === false;

  const routesToRender = isAuthenticated ? privateRoutePaths : publicRoutePaths;
  usePageTitle();

  // const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

  const logError = (error: Error, info: ErrorInfo): void => {
    Sentry.captureException(error);
  };
  const isPublicRoute = publicRoutePaths.some((route) =>
    matchPath({ path: route.path, end: false }, location.pathname)
  );

  const isPrivateRoute = privateRoutePaths.some((route) =>
    matchPath({ path: route.path, end: false }, location.pathname)
  );

  return (
    <ErrorBoundary FallbackComponent={ErrorPage} onError={logError}>
      <Routes>
        {!isAuthenticated && !isPublicRoute ? (
          isPrivateRoute ? (
            <Route path='/*' element={<LoginPage />} />
          ) : (
            <Route path='/*' element={<UnknownPage />} />
          )
        ) : (
          routesToRender.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))
        )}
      </Routes>{" "}
    </ErrorBoundary>
  );
};

export { AppRoutes };
