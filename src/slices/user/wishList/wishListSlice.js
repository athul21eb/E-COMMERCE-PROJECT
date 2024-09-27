 import { createSlice } from "@reduxjs/toolkit";

 const wishListSlice = createSlice({
    name: 'wishList',
    initialState:{wishListDetails:null},
    reducers:{
        setWishList :(state,action)=>{
            state.wishListDetails = action.payload;
        }
    }
 })

 export default wishListSlice.reducer;

 export const {setWishList} = wishListSlice.actions