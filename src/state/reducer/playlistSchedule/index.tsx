import { createSlice } from "@reduxjs/toolkit";
import { getScheduleList, savePlaylistSchedule } from "~/state/thunk/playlistSchedule";
import { PlaylistSchedule, SchedulePlaylistDetail } from "~/types/PlaylistSchedule";

interface InitialStateType {
    listSchedule: Array<PlaylistSchedule>;
    loading: boolean;
    playlistScheduleDetail: SchedulePlaylistDetail;
};

const initialState: InitialStateType = {
    listSchedule: [],
    loading: false,
    playlistScheduleDetail: {} as SchedulePlaylistDetail
};

const playlistScheduleSlice = createSlice({
    name: 'playlistSchedule',
    initialState,
    reducers: {
        setPlaylistScheduleDetail: (state, action) => {
            state.playlistScheduleDetail = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(getScheduleList.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getScheduleList.fulfilled, (state, action) => {
            state.loading = false;
            state.listSchedule = action.payload;
        });
        builder.addCase(getScheduleList.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(savePlaylistSchedule.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(savePlaylistSchedule.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(savePlaylistSchedule.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
    }
});

export const { setPlaylistScheduleDetail } = playlistScheduleSlice.actions;
export const playlistScheduleReducer = playlistScheduleSlice.reducer;