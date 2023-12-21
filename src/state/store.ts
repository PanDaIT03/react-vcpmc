import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import { roleReducer } from "./reducer/role";
import { userReducer } from "./reducer/user";
import { recordReducer } from "./reducer/record";
import { contractReducer } from "./reducer/contract";
import { playListReducer } from "./reducer/playlist";

export const store = configureStore({
  reducer: {
    user: userReducer,
    role: roleReducer,
    contract: contractReducer,
    record: recordReducer,
    playlist: playListReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
