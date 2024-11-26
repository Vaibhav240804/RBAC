import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../API";

const initialState = {
  permissions: [],
  allPermissions: [],
  openedResource: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const getAllPermissions = createAsyncThunk(
  "permission/getAllPermissions",
  async (_, thunkAPI) => {
    try {
      const res = await API.getPermissions();
      return res;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.toString() ||
        error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
      state.permissions = [];
      state.allPermissions = [];
      state.openedResource = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllPermissions.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllPermissions.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.permissions = action.payload.permissions;
      state.allPermissions = action.payload.permissions;
    });
    builder.addCase(getAllPermissions.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });
  },
});

export const { reset } = permissionSlice.actions;

export default permissionSlice.reducer;
