import { createSlice } from "@reduxjs/toolkit";

const PublicSlice = createSlice({
  name: "Public",
  initialState: {
    products: [],
  },

  reducers: {
    setPublicProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export default PublicSlice.reducer;

export const { setPublicProducts } = PublicSlice.actions;
