import { Layout } from "@app/AppLayout";
import { Deck } from "@app/Features/Deck/Deck";
import { Extract } from "@app/Features/Extract/Extract";
import { Main } from "@app/Main/Main";
import Account from "@pages/Account";
import Study from "@pages/Study";
// import Blog from "@pages/Blog/Blog";
// import { Contact } from "@pages/Contact/Contact";
// import { Documentation } from "@pages/Documentation/Documentation";
// import { Legal } from "@pages/Legal/Legal";
// import { Pricing } from "@pages/Pricing/Pricing";
// import { Terms } from "@pages/Terms/Terms";
import React from "react";

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
    path: "/account",
    element: (
      <Layout>
        <Account />
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
  {
    path: "/deck/:deckId",
    element: (
      <Layout>
        <Deck />
      </Layout>
    ),
  },
  {
    path: "/study",
    element: (
      <Layout>
        <Study />
      </Layout>
    ),
  },
  // {
  //   path: "/blog/:slug",
  //   element: (
  //     <PublicLayout>
  //       <Blog />
  //     </PublicLayout>
  //   ),
  // },
  // {
  //   path: "/blog",
  //   element: (
  //     <PublicLayout>
  //       <Blog />
  //     </PublicLayout>
  //   ),
  // },
  // {
  //   path: "/pricing",
  //   element: (
  //     <PublicLayout>
  //       <Pricing />
  //     </PublicLayout>
  //   ),
  // },
  // {
  //   path: "/documentation",
  //   element: (
  //     <PublicLayout>
  //       <Documentation />
  //     </PublicLayout>
  //   ),
  // },
  // {
  //   path: "/terms",
  //   element: (
  //     <PublicLayout>
  //       <Terms />
  //     </PublicLayout>
  //   ),
  // },
  // {
  //   path: "/legal",
  //   element: (
  //     <PublicLayout>
  //       <Legal />
  //     </PublicLayout>
  //   ),
  // },
  // {
  //   path: "/contact",
  //   element: (
  //     <PublicLayout>
  //       <Contact />
  //     </PublicLayout>
  //   ),
  // },
];

export { privateRoutePaths };
