import { Layout } from "@app/AppLayout";
import { DeckPage } from "@app/Features/Deck/Deck";
import { Extract } from "@app/Features/Extract/Extract";
import { Groups } from "@app/Features/Groups/Groups";
import { Play } from "@app/Features/Play/Play";
import { Quiz } from "@app/Features/Quiz/Quiz";
import { Study } from "@app/Features/Study/Study";
import { Logout } from "@app/Main/Logout";
import { Main } from "@app/Main/Main";
import Account from "@pages/Account";
import { Quizzes } from "@source/components/App/Features/Quizzes/Quizzes";
// import Study from "@pages/Study";
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
    path: "/logout",
    element: (
      <Layout>
        <Logout />
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
        <DeckPage />
      </Layout>
    ),
  },
  {
    path: "/groups",
    element: (
      <Layout>
        <Groups />
      </Layout>
    ),
  },
  {
    path: "/play",
    element: (
      <Layout>
        <Play />
      </Layout>
    ),
  },
  {
    path: "/quizzes",
    element: (
      <Layout>
        <Quizzes />
      </Layout>
    ),
  },
  {
    path: "/quiz/:quizId",
    element: (
      <Layout>
        <Quiz />
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
