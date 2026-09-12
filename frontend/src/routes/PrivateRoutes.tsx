import { Logout } from '@pages/Dashboard/Logout'
import { FlexContextProvider } from '@source/lib/contexts/FlexContext'
import { PromoAdmin } from '@source/pages/Admin/PromoAdmin'
import Layout from '@source/pages/layouts/PrivateLayout'
// import PublicHub from "@source/pages/QuizShared/PublicHub";
import React, { lazy, Suspense } from 'react'

import { DelayedFallback } from './DelayedFallback'

const ManageBanner = lazy(
    async () =>
        await import('@source/common/InfoComponents/InfoBanner/ManageBanner')
)

const Main = lazy(async () => await import('@pages/Dashboard'))
const DeckPage = lazy(async () => await import('@pages/Deck'))
const Decks = lazy(async () => await import('@source/pages/Decks'))
const UpgradePage = lazy(async () => await import('@pages/Upgrade'))
const Admin = lazy(async () => await import('@source/pages/Admin'))
const Community = lazy(async () => await import('@source/pages/Community'))
const DataEval = lazy(async () => await import('@source/pages/DataEval'))
const Group = lazy(async () => await import('@source/pages/Group'))
const Groups = lazy(async () => await import('@source/pages/Groups'))
const FAQ = lazy(async () => await import('@source/pages/InfoPages/FAQ'))
const PrintQuiz = lazy(
    async () => await import('@source/pages/Quiz/PrintQuiz/PrintQuiz')
)
const SchoolsAdmin = lazy(
    async () => await import('@source/pages/Admin/SchoolsAdmin')
)
const DeckShared = lazy(async () => await import('@source/pages/DeckShared'))

const Register = lazy(async () => await import('@source/pages/Register'))
const TermsPage = lazy(async () => await import('@source/pages/Terms'))
const Privacy = lazy(
    async () => await import('@source/pages/InfoPages/Privacy')
)
// const QuizResult = lazy(async () => await import("@source/pages/QuizResult"));
const GradeResult = lazy(
    async () => await import('@source/pages/QuizResult/GradeResult')
)
const Newsletter = lazy(
    async () => await import('@source/pages/UtilityPages/Newsletter')
)

const Tutorials = lazy(
    async () => await import('@source/pages/InfoPages/Tutorials')
)
const Quizzes = lazy(async () => await import('../pages/Quizzes'))
const Hub = lazy(async () => await import('../pages/Quiz/Hub'))
const DeckToStudy = lazy(
    async () => await import('@source/pages/Study/components/DeckToStudy')
)
const Study = lazy(async () => await import('@source/pages/Study'))
const FlexGame = lazy(
    async () => await import('@source/pages/Game/components/Setup')
)
const InGame = lazy(
    async () => await import('@source/pages/Game/components/InGame')
)

const Quiz = lazy(async () => await import('@source/pages/Quiz'))
const Account = lazy(async () => await import('@source/pages/Account'))
const Pricing = lazy(async () => await import('@source/pages/Pricing'))
const Documentation = lazy(
    async () => await import('@source/pages/InfoPages/Documentation')
)
const Extract = lazy(async () => await import('@source/pages/Extract'))
const Blog = lazy(async () => await import('@source/pages/Blog'))
const Contact = lazy(
    async () => await import('@source/pages/InfoPages/Contact')
)
const Terms = lazy(async () => await import('@source/pages/Terms'))
const Legal = lazy(async () => await import('@source/pages/Legal'))
const EditQuiz = lazy(async () => await import('@source/pages/Quiz/EditQuiz'))
const CreateQuiz = lazy(
    async () => await import('@source/pages/Quizzes/CreateQuiz')
)

const GamePicker = lazy(async () => await import('@source/pages/Game'))

const privateRoutePaths = [
    {
        path: '/',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <Main />
                </Suspense>
            </Layout>
        ),
    },
    {
        // Adding this here so that the user can access step 4 of the onboarding process at which point they are logged in
        path: '/register',
        element: (
            <Suspense fallback={<DelayedFallback />}>
                <Register />
            </Suspense>
        ),
    },

    {
        path: '/account',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <Account />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/create-deck',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <Extract />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/deck/:deckId',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <DeckPage />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/decks',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <Decks />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/data-eval',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <DataEval />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/groups',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <Groups />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/deck/shared/:sharedDeckId',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <DeckShared />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/Terms',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <TermsPage />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/legal',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <Legal />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/quizzes',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <Quizzes />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/quizzes/create/:deckId',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <CreateQuiz />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/quiz/shared',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <Hub />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/quiz/:quizId',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <Quiz />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/quiz/hub/:quizId',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <Hub />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/quiz/edit/:quizId',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <EditQuiz />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/quiz/:quizId/grade-result/:resultId',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <GradeResult />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/quiz/:quizId/result/:resultId',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <GradeResult />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/group/:groupId',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <Group />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/study',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <Study />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/study/deck/:deckId',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <DeckToStudy />
                </Suspense>
            </Layout>
        ),
    },

    {
        path: '/upgrade',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <UpgradePage />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/community',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <Community />
                </Suspense>
            </Layout>
        ),
    },

    {
        path: '/game',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <GamePicker />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/game/:gameType',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <FlexGame />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/game/flex/:rawGameId',
        element: (
            <Layout isTransparentNav>
                <Suspense fallback={<DelayedFallback />}>
                    <FlexContextProvider>
                        <InGame />
                    </FlexContextProvider>
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/game/classic/:rawGameId',
        element: (
            <Layout isTransparentNav>
                <Suspense fallback={<DelayedFallback />}>
                    <FlexContextProvider>
                        <InGame />
                    </FlexContextProvider>
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/game/flex/join/:rawGameId',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <FlexContextProvider>
                        <InGame />
                    </FlexContextProvider>

                    {/* <Join /> */}
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/game/classic/join/:rawGameId',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <FlexContextProvider>
                        <InGame />
                    </FlexContextProvider>

                    {/* <Join /> */}
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/sign-out',
        element: <Logout />,
    },

    {
        path: '/quiz/print/:quizId',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <PrintQuiz />
                </Suspense>
            </Layout>
        ),
    },

    {
        path: '/blog/:slug',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <Blog />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/blog',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <Blog />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/documentation',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <Documentation />
                </Suspense>
            </Layout>
        ),
    },

    {
        path: '/pricing',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <Pricing />
                </Suspense>
            </Layout>
        ),
    },

    {
        path: '/terms',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <Terms />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/legal',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <Legal />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/contact',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <Contact />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/logged-out',

        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <Main />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/admin',

        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <Admin />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/privacy',

        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <Privacy />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/admin/review',

        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <DataEval />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/admin/schools',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <SchoolsAdmin />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/admin/promo',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <PromoAdmin />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/admin/banner',

        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    <ManageBanner />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/FAQ',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    {' '}
                    <FAQ />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/tutorials',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    {' '}
                    <Tutorials />
                </Suspense>
            </Layout>
        ),
    },
    {
        path: '/newsletter',
        element: (
            <Layout>
                <Suspense fallback={<DelayedFallback />}>
                    {' '}
                    <Newsletter />
                </Suspense>
            </Layout>
        ),
    },
]

export { privateRoutePaths }
