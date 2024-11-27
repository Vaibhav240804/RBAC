import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/authSlice";
import roleReducer from "../redux/roleSlice";
import sharedReducer from "../redux/sharedSlice";
import iamReducer from "../redux/iamSlice";
import permReducer from "../redux/permSlice";
import resReducer from "../redux/resourceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    role: roleReducer,
    shared: sharedReducer,
    secUser: iamReducer,
    perm: permReducer,
    resrc: resReducer,
  },
});
