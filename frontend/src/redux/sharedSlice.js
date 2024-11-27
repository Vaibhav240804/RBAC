import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  iamUsers: [],
  roles: [],
  accountId: "",
  password: "",
  createdRoles: [],
  currComponent: "users",
};

const sharedSlice = createSlice({
  name: "shared",
  initialState,
  reducers: {
    setIamUsers: (state, action) => {
      state.iamUsers = action.payload;
    },
    setRoles: (state, action) => {
      state.roles = action.payload;
    },
    setCreatedRoles: (state, action) => {
      state.createdRoles = action.payload;
    },
    setCurrComponent: (state, action) => {
      state.currComponent = action.payload;
    },
    setCredentials: (state, action) => {
      state.accountId = action.payload.iamUser.accountId;
      state.password = action.payload.iamUser.password;
    },
  },
});

export const {
  setIamUsers,
  setRoles,
  setCreatedRoles,
  setCurrComponent,
  setCredentials,
} = sharedSlice.actions;
export default sharedSlice.reducer;
