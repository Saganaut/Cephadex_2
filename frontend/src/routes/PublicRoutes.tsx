// routes.js
import React from "react";
import LandingPage from "@pages/LandingPage/LandingPage";
import Blog from "@pages/Blog/Blog";
import NotFoundComponent from "@common/NotFoundComponent/NotFoundComponent";
import { PublicLayout } from "@pages/Layout";
import { Pricing } from "@pages/Pricing/Pricing";
import { Documentation } from "@pages/Documentation/Documentation";
import { Terms } from "@pages/Terms/Terms";
import { Legal } from "@pages/Legal/Legal";
import { Contact } from "@pages/Contact/Contact";

const publicRoutePaths = [
  {
    path: "/blog/:slug",
    element: (
      <PublicLayout>
        <Blog />
      </PublicLayout>
    ),
  },
  {
    path: "/",
    element: (
      <PublicLayout>
        <LandingPage />
      </PublicLayout>
    ),
  },
  {
    path: "/blog",
    element: (
      <PublicLayout>
        <Blog />
      </PublicLayout>
    ),
  },
  {
    path: "*",
    element: (
      <PublicLayout>
        <NotFoundComponent />
      </PublicLayout>
    ),
  },
  {
    path: "/pricing",
    element: (
      <PublicLayout>
        <Pricing />
      </PublicLayout>
    ),
  },
  {
    path: "/documentation",
    element: (
      <PublicLayout>
        <Documentation />
      </PublicLayout>
    ),
  },
  {
    path: "/terms",
    element: (
      <PublicLayout>
        <Terms />
      </PublicLayout>
    ),
  },
  {
    path: "/legal",
    element: (
      <PublicLayout>
        <Legal />
      </PublicLayout>
    ),
  },
  {
    path: "/contact",
    element: (
      <PublicLayout>
        <Contact />
      </PublicLayout>
    ),
  },
];

export { publicRoutePaths };
