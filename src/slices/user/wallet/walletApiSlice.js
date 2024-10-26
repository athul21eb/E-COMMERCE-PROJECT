import userApiSlice from "../../../app/api/user/userApiSlice";



const walletUrl = '/user/wallet/'

const walletApiSlice = userApiSlice.injectEndpoints({
    endpoints:(builder)=>({
        
        getWalletDetails :builder.query({
            query:()=> walletUrl
        }),
        createWallet: builder.mutation({
            query:(data)=>({
                url:`${walletUrl}/create`,
                method:"POST",
                body:data
            })
        })

    })
})