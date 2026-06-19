import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from './api';

export const checkoutOrder = createAsyncThunk(
  'cart/checkout',
  async (checkoutData, { rejectWithValue }) => {
    try {
      const data = await apiRequest('/api/orders/checkout', {
        method: 'POST',
        body: checkoutData,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem('eay_cart');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const saveCartToStorage = (items) => {
  try {
    localStorage.setItem('eay_cart', JSON.stringify(items));
  } catch (e) {
    // Ignore storage errors
  }
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromStorage(),
    isCheckingOut: false,
    checkoutError: null,
  },
  reducers: {
    addItem: (state, action) => {
      const { id, name, image, price, qty = 1, size = 'M', color = 'Default', customName = '', customNumber = '', customDetails = null } = action.payload;
      
      const uniqueKey = `${id}-${size}-${color}-${customName}-${customNumber}-${customDetails ? JSON.stringify(customDetails) : ''}`;
      
      const existingIndex = state.items.findIndex(item => item.uniqueKey === uniqueKey);
      
      if (existingIndex !== -1) {
        state.items[existingIndex].qty += qty;
      } else {
        const tags = [
          { label: `Size: ${size}` },
          { label: `Color: ${color}` }
        ];
        if (customName) tags.push({ label: `Name: ${customName.toUpperCase()}` });
        if (customNumber) tags.push({ label: `Number: ${customNumber}` });
        if (customDetails) tags.push({ label: 'Custom 3D Spec' });

        state.items.push({
          uniqueKey,
          id,
          name,
          image,
          price,
          qty,
          size,
          color,
          customName,
          customNumber,
          customDetails,
          tags
        });
      }
      saveCartToStorage(state.items);
    },
    removeItem: (state, action) => {
      const uniqueKey = action.payload;
      state.items = state.items.filter(item => item.uniqueKey !== uniqueKey);
      saveCartToStorage(state.items);
    },
    updateQty: (state, action) => {
      const { uniqueKey, qty } = action.payload;
      const item = state.items.find(item => item.uniqueKey === uniqueKey);
      if (item) {
        item.qty = Math.max(1, qty);
      }
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkoutOrder.pending, (state) => {
        state.isCheckingOut = true;
        state.checkoutError = null;
      })
      .addCase(checkoutOrder.fulfilled, (state) => {
        state.isCheckingOut = false;
        state.items = [];
        saveCartToStorage(state.items);
      })
      .addCase(checkoutOrder.rejected, (state, action) => {
        state.isCheckingOut = false;
        state.checkoutError = action.payload;
      });
  }
});

export const { addItem, removeItem, updateQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
