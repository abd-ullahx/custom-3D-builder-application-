import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from './api';

export const fetchSavedDesigns = createAsyncThunk(
  'savedDesigns/fetchSavedDesigns',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest('/api/saved-designs');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSavedDesign = createAsyncThunk(
  'savedDesigns/deleteSavedDesign',
  async (id, { rejectWithValue }) => {
    try {
      await apiRequest(`/api/saved-designs/${id}`, { method: 'DELETE' });
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getSavedDesign = createAsyncThunk(
  'savedDesigns/getSavedDesign',
  async (id, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`/api/saved-designs/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveDesign = createAsyncThunk(
  'savedDesigns/saveDesign',
  async (designData, { dispatch, rejectWithValue }) => {
    try {
      const data = await apiRequest('/api/saved-designs', {
        method: 'POST',
        body: designData,
      });
      // Automatically refresh the list so the Profile tab has the latest design
      dispatch(fetchSavedDesigns());
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const savedDesignSlice = createSlice({
  name: 'savedDesigns',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedDesigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedDesigns.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSavedDesigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteSavedDesign.fulfilled, (state, action) => {
        state.items = state.items.filter(design => design.id !== action.payload);
      });
  }
});

export default savedDesignSlice.reducer;
