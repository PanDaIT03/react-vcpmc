import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import { userReducer } from "./reducer/user";
import { roleReducer } from "./reducer/role";
import { contractReducer } from "./reducer/contract";
import { recordReducer } from "./reducer/record";

export const store = configureStore({
    reducer: {
        user: userReducer,
        role: roleReducer,
        contract: contractReducer,
        record: recordReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();