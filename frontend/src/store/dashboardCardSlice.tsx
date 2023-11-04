import { createSlice } from "@reduxjs/toolkit";
import { type DashboardCard } from "@source/types/Globals";

const dashboardCardsSlice = createSlice({
  name: "dashboardCards",
  initialState: [] as DashboardCard[],
  reducers: {
    setDashboardCards: (state, action) => {
      return action.payload;
    },
  },
});
export const { setDashboardCards } = dashboardCardsSlice.actions;
export default dashboardCardsSlice.reducer;
