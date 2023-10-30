// routes.js
import React from "react";
import LandingPage from "components/Pages/LandingPage/LandingPage";
import Blog from "components/Pages/Blog/Blog";
import NotFoundComponent from "components/Common/NotFoundComponent/NotFoundComponent";
import { Layout } from "components/Pages/Layout";
import { Pricing } from "components/Pages/Pricing/Pricing";
import { Documentation } from "components/Pages/Documentation/Documentation";
import { Terms } from "components/Pages/Terms/Terms";
import { Legal } from "components/Pages/Legal/Legal";
import { Contact } from "components/Pages/Contact/Contact";


const publicRoutePaths = [
  {
    path: "/blog/:slug",
    element: (
      <Layout>
        <Blog />
      </Layout>
    ),
  },
  {
    path: "/",
    element: (
      <Layout>
        <LandingPage />
      </Layout>
    ),
  },
  {
    path: "/blog",
    element: (
      <Layout>
        <Blog />
      </Layout>
    ),
  },
  {
    path: "*",
    element: (
      <Layout>
        <NotFoundComponent />
      </Layout>
    ),
  },
  { path: "/pricing",
    element: (
      <Layout>
        <Pricing />
      </Layout>
    ),
    },
  { path: "/documentation",
    element: (
      <Layout>
      <Documentation />
      </Layout>
      ),
    },
  { path: "/terms",
    element: (
      <Layout>
        <Terms />
      
      </Layout>
      ),
    },
    { path: "/legal",
    element: (
      <Layout>
        <Legal />
      </Layout>
    ),
    },
    { path: "/contact",
    element: (
      <Layout>
        <Contact />
      
      </Layout>
      ),
    }

];

export { publicRoutePaths };
