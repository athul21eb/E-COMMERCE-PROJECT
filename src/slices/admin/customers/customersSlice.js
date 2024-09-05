import { createSlice } from "@reduxjs/toolkit";



const customersSlice = createSlice({


    initialState:{
        customersList:[]
    },
    name:"customers",
    reducers:{

        SetCustomersList:(state,action)=>{

            state.customersList = action.payload;




        }
        
    }
})

export default customersSlice.reducer;

export const {SetCustomersList} = customersSlice.actions;