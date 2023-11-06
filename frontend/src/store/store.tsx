import { configureStore } from "@reduxjs/toolkit";
import dashboardCardsReducer from "./dashboardCardSlice";
import decksReducer from "./decksSlice";
import quizzesReducer from "./quizzesSlice";
import groupsReducer from "./groupsSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    dashboardCards: dashboardCardsReducer,
    decks: decksReducer,
    quizzes: quizzesReducer,
    groups: groupsReducer,
    user: userReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
