import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../API";

const initialState = {
  resources: [],
  openedResource: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const getResources = createAsyncThunk(
  "resource/getResources",
  async ({ user, isRoot }, thunkAPI) => {
    try {
      const res = await API.getResources({ user, isRoot });
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

export const checkPermission = createAsyncThunk(
  "resource/checkPermission",
  async (resourceName, thunkAPI) => {
    try {
      const res = await API.checkPermission(resourceName);
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

const resourceSlice = createSlice({
  name: "resource",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
      state.resources = [];
      state.openedResource = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getResources.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getResources.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.resources = action.payload.resources;
    });
    builder.addCase(getResources.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });

    builder.addCase(checkPermission.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(checkPermission.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.openedResource = action.payload.resource;
    });
    builder.addCase(checkPermission.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });
  },
});

export const { reset } = resourceSlice.actions;

export default resourceSlice.reducer;