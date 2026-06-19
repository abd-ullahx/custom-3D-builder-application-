import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from './api';

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`/api/products/search?query=${encodeURIComponent(query)}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const productSlice = createSlice({
  name: 'products',
  initialState: {
    searchResults: [],
    totalResults: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.totalResults = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload?.products || [];
        state.totalResults = action.payload?.total || 0;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSearchResults } = productSlice.actions;
export default productSlice.reducer;
