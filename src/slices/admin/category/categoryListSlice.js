import { createSlice } from "@reduxjs/toolkit";

const categoriesSlice = createSlice({
    name: "categories",
    initialState: {
        categoriesList: []
    },
    reducers: {
        setCategoriesList: (state, action) => {
            state.categoriesList = action.payload;
        },
    }
});

export default categoriesSlice.reducer;

export const { setCategoriesList } = categoriesSlice.actions;
