// routes.js
import NotFoundComponent from "@common/NotFoundComponent/NotFoundComponent";
import Blog from "@pages/Blog";
import { Contact } from "@pages/Contact";
import { Documentation } from "@pages/Documentation";
import LandingPage from "@pages/LandingPage";
import { PublicLayout } from "@layouts/PublicLayout";
import { Legal } from "@pages/Legal";
import { Pricing } from "@pages/Pricing";
import { Terms } from "@pages/Terms";
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
