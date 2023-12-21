import { createSlice } from "@reduxjs/toolkit";

import {
  getPlayListAction,
  updatePlaylistAction,
} from "~/state/thunk/playlist";
import { IPLaylist } from "~/types/Playlist";

interface InitType {
  playList: IPLaylist[];
  loading: boolean;
  status: string;
}

const initialState: InitType = {
  playList: [],
  loading: false,
  status:
    "get successfully" ||
    "get failed" ||
    "update successfully" ||
    "update failed" ||
    "",
};

const playListSlice = createSlice({
  name: "playlist",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getPlayListAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPlayListAction.fulfilled, (state, action) => {
        state.playList = action.payload;
        state.loading = false;
        state.status = "get successfully";
      })
      .addCase(getPlayListAction.rejected, (state) => {
        state.loading = false;
        state.status = "get failed";
      })
      .addCase(updatePlaylistAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePlaylistAction.fulfilled, (state) => {
        state.loading = false;
        state.status = "update successfully";
      })
      .addCase(updatePlaylistAction.rejected, (state) => {
        state.loading = false;
        state.status = "update failed";
      })
      .addDefaultCase((state) => {
        return state;
      });
  },
});

export const {} = playListSlice.actions;
export const playListReducer = playListSlice.reducer;
