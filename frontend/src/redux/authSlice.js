import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../API";

const initialState = {
  user: null,
  iamUsers: [],
  createdRoles: [],
  isRoot: false,
  isError: false,
  isSuccess: false,
  isLoading: false,
  accountId: null,
  username: "",
  message: "",
  otp: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const res = await API.login(userData);
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

export const logup = createAsyncThunk(
  "auth/logup",
  async (userData, thunkAPI) => {
    try {
      return await API.signup(userData);
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

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    return await API.logout();
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.toString() ||
      error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (otpData, thunkAPI) => {
    try {
      const response = await API.verifyOtp(otpData);
      const { user } = response.data;
      const { iamUsers, roles } = user;
      return { user, iamUsers, roles };
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
      state.iamUsers = [];
      state.createdRoles = [];
      state.username = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload;
      state.isRoot = action.payload.isRoot;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });

    builder.addCase(logup.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logup.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.message = action.payload;
      state.isRoot = true;
    });
    builder.addCase(logup.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });

    builder.addCase(logout.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = null;
      state.iamUsers = [];
      state.createdRoles = [];
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });

    builder.addCase(verifyOtp.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(verifyOtp.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload.user;
      state.iamUsers = action.payload.iamUsers;
      state.createdRoles = action.payload.roles;
    });
    builder.addCase(verifyOtp.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });
  },
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;
