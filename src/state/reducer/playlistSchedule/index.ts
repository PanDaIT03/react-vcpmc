import { createSlice } from "@reduxjs/toolkit";
import {
  getPlaylistScheduleAction,
  removeSchedulePlaybackAction,
} from "~/state/thunk/playlistSchedule";
import { IPlaylistSchedule } from "~/types/PlaylistSchedule";

interface InitType {
  playlistSchedules: IPlaylistSchedule[];
  loading: boolean;
  status: string;
}

const initialState: InitType = {
  playlistSchedules: [],
  loading: false,
  status:
    "get successfully" ||
    "get failed" ||
    "remove successfully" ||
    "remove failed" ||
    "",
};

const playlistScheduleSlice = createSlice({
  name: "playlistSchedule",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getPlaylistScheduleAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPlaylistScheduleAction.fulfilled, (state, action) => {
        state.playlistSchedules = action.payload;
        state.loading = false;
        state.status = "get successfully";
      })
      .addCase(getPlaylistScheduleAction.rejected, (state) => {
        state.loading = false;
        state.status = "get failed";
      })
      .addCase(removeSchedulePlaybackAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeSchedulePlaybackAction.fulfilled, (state) => {
        state.loading = false;
        state.status = "remove successfully";
      })
      .addCase(removeSchedulePlaybackAction.rejected, (state) => {
        state.loading = false;
        state.status = "remove failed";
      })
      .addDefaultCase((state) => {
        return state;
      });
  },
});

export const {} = playlistScheduleSlice.actions;
export const playlistScheduleReducer = playlistScheduleSlice.reducer;
