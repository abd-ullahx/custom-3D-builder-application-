import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from './api';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest('/api/orders');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default orderSlice.reducer;
