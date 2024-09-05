import { createSlice } from "@reduxjs/toolkit";

const productListSlice = createSlice({
    name: "productList",
    initialState: {
        productList: []
    },
    reducers: {
        setProductList: (state, action) => {
            state.productList = action.payload;
        },
    }
});

export default productListSlice.reducer;

export const { setProductList } = productListSlice.actions;
