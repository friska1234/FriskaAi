// lib/features/auth/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
 import { AuthState, LoginCredentials, LoginResponse } from "../types/authTypes";
import { API_URL } from "../features/config"; 
// Initial state - don't access localStorage during SSR
const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  isAuthenticated: false,
  error: null,
};

export const loginUser = createAsyncThunk<
  LoginResponse, // Return type
  LoginCredentials, // Argument type
  { rejectValue: string } // Reject type
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/Member/MemberAuthenticate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: credentials.user,
        password: credentials.password,
        "tenant": "string"
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Invalid email or password");
    }
    
    const data = await response.json() as LoginResponse;
    
    // Store token in localStorage (client-side only)
    if (typeof window !== 'undefined') {
      localStorage.setItem("token", data.token);
    }
    
    return data;
  } catch (error: unknown) {
    return rejectWithValue(error instanceof Error ? error.message : "Login failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      
      // Remove token from localStorage (client-side only)
      if (typeof window !== 'undefined') {
        localStorage.removeItem("token");
      }
    },
    // Hydrate auth state from localStorage on client-side
    hydrate: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem("token");
        if (token) {
          state.token = token;
          state.isAuthenticated = true;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout, hydrate } = authSlice.actions;
export default authSlice.reducer;