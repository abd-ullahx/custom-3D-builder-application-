/**
 * Redux Store — Central state configuration.
 *
 * Slice location convention:
 *  - builderSlice lives in features/builder/ (feature-sliced pattern)
 *  - All other slices live here in store/ for simplicity
 *  - Future slices should be co-located with their feature in features/<name>/<name>Slice.js
 */
import { configureStore } from '@reduxjs/toolkit';
import builderReducer from '../features/builder/builderSlice';  // feature-sliced
import cartReducer from './cartSlice';
import authReducer from './authSlice';
import orderReducer from './orderSlice';
import savedDesignReducer from './savedDesignSlice';
import productReducer from './productSlice';
import wishlistReducer from './wishlistSlice';
import subscriberReducer from './subscriberSlice';

export const store = configureStore({
  reducer: {
    builder: builderReducer,
    cart: cartReducer,
    auth: authReducer,
    orders: orderReducer,
    savedDesigns: savedDesignReducer,
    products: productReducer,
    wishlist: wishlistReducer,
    subscriber: subscriberReducer,
  },
});
