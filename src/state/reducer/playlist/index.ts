import { createSlice } from "@reduxjs/toolkit";

import {
  addPlaylistAction,
  deletePlaylistAction,
  getPlayListAction,
  updatePlaylistAction
} from "~/state/thunk/playlist";
import { IPLaylist } from "~/types/PlaylistType";

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
    "delete successfully" ||
    "delete failed" ||
    "insert successfully" ||
    "insert failed" ||
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
        console.log(action);

        state.playList = action.payload;
        state.loading = false;
        state.status = "get successfully";
      })
      .addCase(getPlayListAction.rejected, (state) => {
        state.loading = false;
        state.status = "get failed";
      })
      .addCase(addPlaylistAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPlaylistAction.fulfilled, (state) => {
        state.loading = false;
        state.status = "insert successfully";
      })
      .addCase(addPlaylistAction.rejected, (state) => {
        state.loading = false;
        state.status = "insert failed";
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
      .addCase(deletePlaylistAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePlaylistAction.fulfilled, (state) => {
        state.status = "delete successfully";
      })
      .addCase(deletePlaylistAction.rejected, (state) => {
        state.loading = false;
        state.status = "delete failed";
      })
      .addDefaultCase((state) => {
        return state;
      });
  },
});

export const {} = playListSlice.actions;
export const playListReducer = playListSlice.reducer;
