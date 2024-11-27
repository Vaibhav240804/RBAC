import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../API";
import { setIamUsers, setRoles, setCreatedRoles } from "./sharedSlice";

const initialState = {
  user: null,
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
      console.log(res);
      if (res.isRoot) {
        return res;
      } else {
        const { roles } = res;
        thunkAPI.dispatch(setRoles(roles));
        return res;
      }
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

export const shareToken = createAsyncThunk(
  "auth/shareToken",
  async (_, thunkAPI) => {
    try {
      const res = await API.sendToken();
      console.log(res);
      if (res.isRoot) {
        const { roles, createdRoles, iamUsers } = res;
        thunkAPI.dispatch(setRoles(roles));
        thunkAPI.dispatch(setCreatedRoles(createdRoles));
        thunkAPI.dispatch(setIamUsers(iamUsers));
        return res;
      } else {
        const { roles } = res;
        thunkAPI.dispatch(setRoles(roles));
        return res;
      }
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
      const res = await API.signup(userData);
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

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const res = await API.logout();
    return res;
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
      const { user, iamUsers, roles, createdRoles } = response;
      thunkAPI.dispatch(setIamUsers(iamUsers));
      thunkAPI.dispatch(setCreatedRoles(createdRoles));
      thunkAPI.dispatch(setRoles(roles));
      return response;
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
      state.isRoot = action.payload.isRoot;
      state.user = state.isRoot ? null : action.payload.user;
      state.accountId = state.isRoot ? null : action.payload.accountId;
      state.username = state.isRoot ? "" : action.payload.username;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });

    builder.addCase(shareToken.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(shareToken.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isRoot = action.payload.isRoot;
      state.user = action.payload.user;
      state.accountId = state.isRoot ? null : action.payload.accountId;
      state.username = state.isRoot ? "" : action.payload.username;
    });
    builder.addCase(shareToken.rejected, (state, action) => {
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
      state.message = action.payload.message;
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
