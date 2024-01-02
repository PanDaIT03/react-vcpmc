import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import { roleReducer } from "./reducer/role";
import { userReducer } from "./reducer/user";
import { recordReducer } from "./reducer/record";
import { contractReducer } from "./reducer/contract";
import { playListReducer } from "./reducer/playlist";
import { playlistScheduleReducer } from "./reducer/playlistSchedule";
import { playlistsRecordsReducer } from "./reducer/playlistsRecords";
import { authorizedContractReducer } from "./reducer/authorizedPartner";
import { deviceReducer } from "./reducer/device";
import { categoryReducer } from "./reducer/category";
import { feedBackReducer } from "./reducer/feedback";

export const store = configureStore({
  reducer: {
    user: userReducer,
    role: roleReducer,
    contract: contractReducer,
    record: recordReducer,
    playlist: playListReducer,
    playlistSchedule: playlistScheduleReducer,
    playlistsRecords: playlistsRecordsReducer,
    authorized: authorizedContractReducer,
    device: deviceReducer,
    category: categoryReducer,
    feedback: feedBackReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
