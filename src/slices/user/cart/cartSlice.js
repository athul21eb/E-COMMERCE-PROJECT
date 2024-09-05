import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {cartDetails:null},
    reducers: {
        setCart: (state, action) => {
            state.cartDetails = action.payload;
        },
    }
});

export default cartSlice.reducer;

export const { setCart } = cartSlice.actions;
