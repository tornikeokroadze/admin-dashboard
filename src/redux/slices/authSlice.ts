import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import { RootState } from "../store";
import { showMessage } from "./messageSlice";

// ================== Interfaces ==================

interface Admin {
  id: number;
  name: string;
  email: string;
  job_title: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  admin: Admin | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

interface SignInPayload {
  email: string;
  password: string;
}

interface SignInResponseData {
  token: string;
  admin: Admin;
}

interface ApiResponseSuccess {
  success: true;
  message: string;
  data: SignInResponseData;
}

interface UpdateAdminProfileParams {
  name: string;
  email: string;
  oldPassword?: string;
  newPassword?: string;
}

interface ApiResponseError {
  success: false;
  message: string;
}

// ================== Initial State ==================

const initialState: AuthState = {
  admin: JSON.parse(localStorage.getItem("admin") || "null"),
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

// ================== Async Thunk ==================

export const signIn = createAsyncThunk<
  SignInResponseData,
  SignInPayload,
  { rejectValue: string }
>("auth/signIn", async (data, { dispatch, rejectWithValue }) => {
  try {
    const response = await api.post<ApiResponseSuccess>("/auth/sign-in", data);
    const { token, admin } = response.data.data;

    localStorage.setItem("token", token);
    localStorage.setItem("admin", JSON.stringify(admin));

    return { token, admin };
  } catch (error: any) {
    const message = error.response?.data?.message || "Sign-in failed";

    if (!error.handled) {
      dispatch(showMessage({ content: message, type: "error" }));
    }
    return rejectWithValue(message);
  }
});

export const signOut = createAsyncThunk<
  void,
  void,
  { rejectValue: string; state: RootState }
>("auth/signOut", async (_, { dispatch, rejectWithValue, getState }) => {
  const state = getState();
  const token = state.auth.token;

  if (!token) {
    return rejectWithValue("No token found");
  }

  try {
    const response = await api.post("/auth/sign-out");

    dispatch(showMessage({ content: response.data.message, type: "success" }));
  } catch (error: any) {
    const message = error.response?.data?.message || "Sign-out failed";
    if (!error.handled) {
      dispatch(showMessage({ content: message, type: "error" }));
    }
    return rejectWithValue(message);
  } finally {
    dispatch(logout());
  }
});

export const verifyToken = createAsyncThunk<
  Admin,
  void,
  { rejectValue: string; state: RootState }
>("auth/verifyToken", async (_, { rejectWithValue, dispatch, getState }) => {
  const token = getState().auth.token;
  const storedAdmin = getState().auth.admin;
  if (!token) return rejectWithValue("No token");

  try {
    const res = await api.get(`/admins/${storedAdmin?.id}`);

    const admin = res.data.data;
    const localAdmin = JSON.parse(localStorage.getItem("admin") || "null");

    if (JSON.stringify(admin) !== JSON.stringify(localAdmin)) {
      // Update Redux and localStorage if admin data is different
      dispatch(updateAdmin(admin));
      localStorage.setItem("admin", JSON.stringify(admin));
    }

    return admin;
  } catch (err: any) {
    console.log("Error while fetch admin");
  }
});

export const updateAdminProfile = createAsyncThunk<
  Admin,
  UpdateAdminProfileParams,
  { rejectValue: string; state: RootState }
>(
  "auth/updateAdminProfile",
  async (formData, { rejectWithValue, dispatch, getState }) => {
    const { token, admin } = getState().auth;

    if (!token || !admin?.id) {
      return rejectWithValue("Unauthorized");
    }

    try {
      const res = await api.put(`/admins/${admin.id}`, {
        name: formData.name,
        email: formData.email,
        ...(formData.oldPassword && formData.newPassword
          ? {
              password: formData.oldPassword,
              new_password: formData.newPassword,
            }
          : {}),
      });

      const updatedAdmin = res.data.data;

      dispatch(updateAdmin(updatedAdmin));
      localStorage.setItem("admin", JSON.stringify(updatedAdmin));
      dispatch(
        showMessage({
          content: "Profile updated successfully",
          type: "success",
        })
      );

      return updatedAdmin;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to update profile";
      return rejectWithValue(message);
    }
  }
);

// ================== Slice ==================

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.admin = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
    },
    updateAdmin(state, action: PayloadAction<Admin>) {
      state.admin = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        signIn.fulfilled,
        (state, action: PayloadAction<SignInResponseData>) => {
          state.loading = false;
          state.admin = action.payload.admin;
          state.token = action.payload.token;
        }
      )
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Sign-in failed";
      })
      .addCase(signOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.admin = null;
        state.token = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Sign-out failed";
        state.admin = null;
        state.token = null;
      })
      .addCase(verifyToken.fulfilled, (state, action: PayloadAction<Admin>) => {
        state.admin = action.payload;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.admin = null;
        state.token = null;
        state.error = action.payload || "Session invalid";
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.admin = action.payload;
        state.error = null;
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.error = action.payload || "Failed to update profile";
      });
  },
});

export const { logout, updateAdmin } = authSlice.actions;
export default authSlice.reducer;
