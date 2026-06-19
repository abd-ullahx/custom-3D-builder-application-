import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from './api';

const loadUserFromStorage = () => {
  try {
    const savedUser = localStorage.getItem('eay_user');
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (e) {
    return null;
  }
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: credentials,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: userData,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest('/api/auth/logout', { method: 'POST' });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  isAuthenticated: !!loadUserFromStorage(),
  user: loadUserFromStorage(),
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      try {
        localStorage.setItem('eay_user', JSON.stringify(action.payload));
      } catch (e) {}
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      try {
        localStorage.removeItem('eay_user');
      } catch (e) {}
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      try {
        localStorage.setItem('eay_user', JSON.stringify(state.user));
      } catch (e) {}
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        try { localStorage.setItem('eay_user', JSON.stringify(action.payload.user)); } catch (e) {}
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        try { localStorage.setItem('eay_user', JSON.stringify(action.payload.user)); } catch (e) {}
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        try { localStorage.removeItem('eay_user'); } catch (e) {}
      });
  }
});

export const { loginSuccess, logoutSuccess, updateUser } = authSlice.actions;
export default authSlice.reducer;
