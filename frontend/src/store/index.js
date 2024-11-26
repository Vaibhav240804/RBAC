import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../puck/auth/authSlice";
import dashReducer from "../puck/dash/dashSlice";
import expenseReducer from "../puck/Expenses/ExpenseSlice";
import reportReducer from "../puck/report/reportSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dash: dashReducer,
    expenses: expenseReducer,
    report: reportReducer,
  },
});
