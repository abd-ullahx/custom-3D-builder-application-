import { createSlice } from '@reduxjs/toolkit';

const loadWishlistFromStorage = () => {
  try {
    const saved = localStorage.getItem('eay_wishlist');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Filter out any primitive IDs from previous implementation
      return parsed.filter(item => typeof item === 'object' && item !== null);
    }
    return [];
  } catch (e) {
    return [];
  }
};

const saveWishlistToStorage = (items) => {
  try {
    localStorage.setItem('eay_wishlist', JSON.stringify(items));
  } catch (e) {
    // Ignore storage errors
  }
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: loadWishlistFromStorage(),
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const index = state.items.findIndex(item => (Number(item.id) || item.id) === (Number(product.id) || product.id));
      if (index !== -1) {
        state.items.splice(index, 1);
      } else {
        state.items.push(product);
      }
      saveWishlistToStorage(state.items);
    },
    removeFromWishlist: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => (Number(item.id) || item.id) !== id);
      saveWishlistToStorage(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage(state.items);
    }
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
