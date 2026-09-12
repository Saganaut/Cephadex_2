// import { ParallaxComponent } from "@source/pages/LandingPage";
// import PublicHub from "@source/pages/QuizShared/PublicHub";
import { Logout } from "@pages/Dashboard/Logout";
// import PublicQuizShared from "@pages/QuizShared/PublicQuizShared";
import { NotFoundComponent } from "@source/common/InfoComponents/NotFoundComponent/NotFoundComponent";
import { FlexContextProvider } from "@source/lib/contexts/FlexContext";
import Layout from "@source/pages/layouts/PrivateLayout";
import { PublicLayout } from "@source/pages/layouts/PublicLayout";
import React, { lazy, Suspense } from "react";

import { DelayedFallback } from "./DelayedFallback";
const InGame = lazy(
  async () => await import("@source/pages/Game/components/InGame")
);

const LandingPage = lazy(async () => await import("@source/pages/LandingPage"));
const DeckShared = lazy(async () => await import("@source/pages/DeckShared"));
const Join = lazy(
  async () => await import("@source/pages/Game/components/Join")
);

const LoggedOut = lazy(
  async () => await import("@source/pages/LoggedOut/LoggedOut")
);
const FAQ = lazy(async () => await import("@source/pages/InfoPages/FAQ"));
const Quiz = lazy(async () => await import("@source/pages/Quiz"));
const QuizResult = lazy(async () => await import("@source/pages/QuizResult"));
const Newsletter = lazy(
  async () => await import("@source/pages/UtilityPages/Newsletter")
);
const Tutorials = lazy(
  async () => await import("@source/pages/InfoPages/Tutorials")
);
const Register = lazy(async () => await import("@source/pages/Register"));

const Privacy = lazy(
  async () => await import("@source/pages/InfoPages/Privacy")
);
const Hub = lazy(async () => await import("../pages/Quiz/Hub"));
const TermsPage = lazy(async () => await import("@source/pages/Terms"));
const Blog = lazy(async () => await import("@source/pages/Blog"));
const Contact = lazy(
  async () => await import("@source/pages/InfoPages/Contact")
);

const Legal = lazy(async () => await import("@source/pages/Legal"));
const Pricing = lazy(async () => await import("@source/pages/Pricing"));
const Documentation = lazy(
  async () => await import("@source/pages/InfoPages/Documentation")
);
const publicRoutePaths = [
  {
    path: "/FAQ",
    element: (
      <PublicLayout>
        <Suspense fallback={<DelayedFallback />}>
          {" "}
          <FAQ />
        </Suspense>
      </PublicLayout>
    ),
  },
  {
    path: "/tutorials",
    element: (
      <PublicLayout>
        <Suspense fallback={<DelayedFallback />}>
          {" "}
          <Tutorials />
        </Suspense>
      </PublicLayout>
    ),
  },
  {
    path: "/blog/:slug",
    element: (
      <PublicLayout>
        <Suspense fallback={<DelayedFallback />}>
          <Blog />
        </Suspense>
      </PublicLayout>
    ),
  },
  {
    path: "/blog",
    element: (
      <PublicLayout>
        <Suspense fallback={<DelayedFallback />}>
          <Blog />
        </Suspense>
      </PublicLayout>
    ),
  },
  // {
  //   path: "/parallax",

  //   element: (
  //     <PublicLayout bgColor={"bg-tolopea"}>
  //       <ParallaxComponent />,
  //     </PublicLayout>
  //   ),
  // },
  {
    path: "/",
    element: (
      <PublicLayout>
        <Suspense fallback={<DelayedFallback />}>
          <LandingPage />
        </Suspense>
      </PublicLayout>
    ),
  },
  {
    path: "/quiz/:quizId",
    element: (
      <PublicLayout>
        <Suspense fallback={<DelayedFallback />}>
          <Quiz />
        </Suspense>
      </PublicLayout>
    ),
  },
  {
    path: "/quiz/:quizId/result/:resultId",
    element: (
      <PublicLayout>
        <Suspense fallback={<DelayedFallback />}>
          <QuizResult />
        </Suspense>
      </PublicLayout>
    ),
  },
  {
    path: "/quiz/shared",
    element: (
      <PublicLayout>
        <Suspense fallback={<DelayedFallback />}>
          <Hub />
        </Suspense>
      </PublicLayout>
    ),
  },

  {
    path: "/blog",
    element: (
      <PublicLayout>
        <Suspense fallback={<DelayedFallback />}>
          <Blog />
        </Suspense>
      </PublicLayout>
    ),
  },
  {
    path: "/deck/shared/:sharedDeckId",
    element: (
      <PublicLayout>
        <Suspense fallback={<DelayedFallback />}>
          <DeckShared />
        </Suspense>
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
        <Suspense fallback={<DelayedFallback />}>
          <Pricing />
        </Suspense>
      </PublicLayout>
    ),
  },
  {
    path: "/documentation",
    element: (
      <PublicLayout>
        <Suspense fallback={<DelayedFallback />}>
          <Documentation />
        </Suspense>
      </PublicLayout>
    ),
  },
  {
    path: "/Terms",
    element: (
      <PublicLayout>
        <Suspense fallback={<DelayedFallback />}>
          <TermsPage />
        </Suspense>
      </PublicLayout>
    ),
  },
  {
    path: "/legal",
    element: (
      <PublicLayout>
        <Suspense fallback={<DelayedFallback />}>
          <Legal />
        </Suspense>
      </PublicLayout>
    ),
  },
  {
    path: "/contact",
    element: (
      <PublicLayout>
        <Suspense fallback={<DelayedFallback />}>
          <Contact />
        </Suspense>
      </PublicLayout>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<DelayedFallback />}>
        <Register />
      </Suspense>
    ),
  },
  {
    path: "/sign-out",
    element: (
      <PublicLayout>
        <Logout />
      </PublicLayout>
    ),
  },
  {
    path: "/game/flex/join/:rawGameId",
    element: (
      <PublicLayout>
        <Suspense fallback={<DelayedFallback />}>
          <FlexContextProvider>
            <Join />
          </FlexContextProvider>
        </Suspense>
      </PublicLayout>
    ),
  },
  {
    path: "/game/classic/join/:rawGameId",
    element: (
      <PublicLayout>
        <Suspense fallback={<DelayedFallback />}>
          <FlexContextProvider>
            <Join />
          </FlexContextProvider>
        </Suspense>
      </PublicLayout>
    ),
  },
  {
    path: "/game/flex/:rawGameId",
    element: (
      <Layout isGuest>
        <Suspense fallback={<DelayedFallback />}>
          <FlexContextProvider>
            <InGame />
          </FlexContextProvider>
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/game/classic/:rawGameId",
    element: (
      <Layout isGuest>
        <Suspense fallback={<DelayedFallback />}>
          <FlexContextProvider>
            <InGame />
          </FlexContextProvider>
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/privacy",

    element: (
      <PublicLayout>
        <Suspense fallback={<DelayedFallback />}>
          <Privacy />
        </Suspense>
      </PublicLayout>
    ),
  },
  {
    path: "/logged-out",
    element: (
      <PublicLayout>
        <LoggedOut />
      </PublicLayout>
    ),
  },
  {
    path: "/newsletter",
    element: (
      <PublicLayout>
        <Suspense fallback={<DelayedFallback />}>
          <Newsletter />
        </Suspense>
      </PublicLayout>
    ),
  },
];

export { publicRoutePaths };
