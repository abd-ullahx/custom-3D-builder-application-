import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from './api';

export const subscribeToNewsletter = createAsyncThunk(
  'subscriber/subscribeToNewsletter',
  async (email, { rejectWithValue }) => {
    try {
      const data = await apiRequest('/api/subscribe', {
        method: 'POST',
        body: { email },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Subscription failed.');
    }
  }
);

export const subscriberSlice = createSlice({
  name: 'subscriber',
  initialState: {
    loading: false,
    success: false,
    error: null,
    message: null,
  },
  reducers: {
    resetSubscriptionState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeToNewsletter.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.message = null;
      })
      .addCase(subscribeToNewsletter.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(subscribeToNewsletter.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  }
});

export const { resetSubscriptionState } = subscriberSlice.actions;
export default subscriberSlice.reducer;
