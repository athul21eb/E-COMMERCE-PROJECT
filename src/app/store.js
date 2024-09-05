import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import authReducer from "../slices/auth/authSlice.js";
import customersReducer from "../slices/admin/customers/customersSlice.js";
import categoriesReducer from '../slices/admin/category/categoryListSlice.js';
import brandsReducer from '../slices/admin/brands/brandsListSlice.js';
import productsReducer from '../slices/admin/products/productListSlice.js';
import { apiSlice } from "./api/auth/authenticationApiSlice.js";
import { adminApiSlice } from "./api/admin/adminApiSlice.js";
import userApiSlice from "./api/user/userApiSlice.js";
import publicReducer from '../slices/public/publicSlice.js';
import cartReducer  from "../slices/user/cart/cartSlice.js";
import AddressReducer  from "../slices/user/profile/address/addressSlice.js";
// Configuration for persisting the auth slice
const authPersistConfig = {
  key: "auth",
  storage,
};

// Wrap the auth reducer with persistReducer
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const store = configureStore({
  reducer: {

    ////authenction slice
    auth: persistedAuthReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    ///// admin slices
    customers: customersReducer,
    categories: categoriesReducer,
    brands: brandsReducer,
    products: productsReducer,
    [adminApiSlice.reducerPath]: adminApiSlice.reducer,
    //// user slices
    public: publicReducer,
    userAddresses:AddressReducer,
   cart:cartReducer,
    [userApiSlice.reducerPath]:userApiSlice.reducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/FLUSH',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }).concat(apiSlice.middleware, adminApiSlice.middleware,userApiSlice.middleware),
});

// Persistor
const persistor = persistStore(store);

export { store, persistor };
