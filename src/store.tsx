
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/features/user/userSlice"


const store = configureStore({

    reducer:{

        user: userReducer

    }

})

//Define the types for global state and dispatch

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store

