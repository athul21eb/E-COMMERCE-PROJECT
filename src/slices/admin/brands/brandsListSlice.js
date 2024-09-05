import { createSlice } from "@reduxjs/toolkit";

const brandsSlice = createSlice({
    name: "brands",
    initialState: {
        brandsList: []
    },
    reducers: {
        setBrandsList: (state, action) => {
            state.brandsList = action.payload;
        },
    }
});

export default brandsSlice.reducer;

export const { setBrandsList } = brandsSlice.actions;
