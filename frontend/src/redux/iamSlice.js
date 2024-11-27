import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../API";
import { setIamUsers, setCredentials } from "./sharedSlice";

const initialState = {
  openedUser: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const createIAMUser = createAsyncThunk(
  "iam/createIAMUser",
  async (userData, thunkAPI) => {
    try {
      const res = await API.createUser(userData);
      // const state = thunkAPI.getState();
      // const iamUsers = state.shared.iamUsers;
      // iamUsers.push(res.iamUser);
      // thunkAPI.dispatch(setIamUsers(iamUsers));
      thunkAPI.dispatch(setCredentials(res));
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

export const getIAMUsers = createAsyncThunk(
  "iam/getIAMUsers",
  async (_, thunkAPI) => {
    try {
      const res = await API.getIAMUsers();
      thunkAPI.dispatch(setIamUsers(res.iamUsers));
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

export const deleteIAMUser = createAsyncThunk(
  "iam/deleteIAMUser",
  async (iamUserId, thunkAPI) => {
    try {
      const res = await API.deleteUserbyId(iamUserId);
      const state = thunkAPI.getState();
      const iamUsers = state.shared.iamUsers;
      const updatedIamUsers = iamUsers.filter(
        (user) => user._id !== res.iamUser._id
      );
      thunkAPI.dispatch(setIamUsers(updatedIamUsers));
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

export const getAuser = createAsyncThunk(
  "iam/getAuser",
  async (iamUsername, thunkAPI) => {
    try {
      const res = await API.getAuser(iamUsername);
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

export const toggleStatus = createAsyncThunk(
  "iam/toggleStatus",
  async ({ iamUserId, data }, thunkAPI) => {
    try {
      const res = await API.toggleStatus(iamUserId, data);
      const state = thunkAPI.getState();
      const iamUsers = state.shared.iamUsers;
      const updatedIamUsers = iamUsers.map((user) =>
        user._id === iamUserId ? { ...user, status: data.status } : user
      );
      thunkAPI.dispatch(setIamUsers(updatedIamUsers));
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

const iamSlice = createSlice({
  name: "iam",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
      state.openedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createIAMUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createIAMUser.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(createIAMUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });

    builder.addCase(getIAMUsers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getIAMUsers.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(getIAMUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });

    builder.addCase(deleteIAMUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteIAMUser.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(deleteIAMUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });

    builder.addCase(getAuser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAuser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.openedUser = action.payload.iamUser;
    });
    builder.addCase(getAuser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });

    builder.addCase(toggleStatus.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(toggleStatus.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(toggleStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });
  },
});

export const { reset } = iamSlice.actions;

export default iamSlice.reducer;
