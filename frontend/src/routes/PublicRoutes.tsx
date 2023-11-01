// routes.js
import NotFoundComponent from "@common/NotFoundComponent/NotFoundComponent";
import Blog from "@pages/Blog/Blog";
import { Contact } from "@pages/Contact/Contact";
import { Documentation } from "@pages/Documentation/Documentation";
import LandingPage from "@pages/LandingPage/LandingPage";
import { PublicLayout } from "@pages/Layout";
import { Legal } from "@pages/Legal/Legal";
import { Pricing } from "@pages/Pricing/Pricing";
import { Terms } from "@pages/Terms/Terms";
import React from "react";

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
