import React from "react";
import { Main } from "components/App/Main/Main";
import { Layout } from "components/App/AppLayout";
import { Extract } from "components/App/Features/Extract/Extract";

const privateRoutePaths = [
  {
    path: "/",
    element: (
      <Layout>
        <Main />
      </Layout>
    ),
  },
  {
    path: "/create-Deck",
    element: (
      <Layout>
        <Extract />
      </Layout>
    ),
  },
];

export { privateRoutePaths };
