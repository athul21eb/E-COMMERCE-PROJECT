import { createSlice } from "@reduxjs/toolkit";

const addressSlice = createSlice({
    name: "address",
    initialState: {
        addresses: [], // Initial state is an empty array for storing addresses
    },
    reducers: {
        setAddresses: (state, action) => {
            state.addresses = action.payload;
        },
    }
});

export default addressSlice.reducer;

export const { setAddresses } = addressSlice.actions;
