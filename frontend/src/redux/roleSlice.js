import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../API";
import { setRoles, setIamUsers, setCreatedRoles } from "./sharedSlice";

const initialState = {
  resources: [],
  openedRole: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const getResources = createAsyncThunk(
  "role/getResources",
  async (userData, thunkAPI) => {
    try {
      const res = await API.getResources(userData);
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

export const createRole = createAsyncThunk(
  "role/createRole",
  async (roleData, thunkAPI) => {
    try {
      const res = await API.createRole(roleData);
      thunkAPI.dispatch(setCreatedRoles(res.roles));
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

export const assignRoles = createAsyncThunk(
  "role/assignRoles",
  async (assignData, thunkAPI) => {
    try {
      const res = await API.assignRoles(assignData);
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

export const getCurrUsersRoles = createAsyncThunk(
  "role/getCurrUsersRoles",
  async (_, thunkAPI) => {
    try {
      const res = await API.getCurrUsersRoles();
      thunkAPI.dispatch(setCreatedRoles(res));
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

export const getRoleById = createAsyncThunk(
  "role/getRoleById",
  async (roleId, thunkAPI) => {
    try {
      const res = await API.getRoleById(roleId);
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

export const deleteRolebyId = createAsyncThunk(
  "role/deleteRolebyId",
  async (roleId, thunkAPI) => {
    try {
      const res = await API.deleteRolebyId(roleId);
      thunkAPI.dispatch(setCreatedRoles(res.roles));
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

export const removePermissionFromRole = createAsyncThunk(
  "role/removePermissionFromRole",
  async (data, thunkAPI) => {
    try {
      const res = await API.removePermission(data);
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

export const addPermissionToRole = createAsyncThunk(
  "role/addPermissionToRole",
  async (data, thunkAPI) => {
    try {
      const res = await API.addPermission(data);
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

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
      state.resources = [];
      state.openedRole = null;
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

    builder.addCase(createRole.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createRole.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(createRole.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });

    builder.addCase(assignRoles.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(assignRoles.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(assignRoles.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });

    builder.addCase(getCurrUsersRoles.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCurrUsersRoles.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(getCurrUsersRoles.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });

    builder.addCase(getRoleById.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getRoleById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.openedRole = action.payload.role;
    });
    builder.addCase(getRoleById.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });

    builder.addCase(deleteRolebyId.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteRolebyId.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(deleteRolebyId.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });

    builder.addCase(removePermissionFromRole.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(removePermissionFromRole.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.openedRole = action.payload.role;
    });
    builder.addCase(removePermissionFromRole.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });

    builder.addCase(addPermissionToRole.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addPermissionToRole.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.openedRole = action.payload.role;
    });
    builder.addCase(addPermissionToRole.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });
  },
});

export const { reset } = roleSlice.actions;
export default roleSlice.reducer;
