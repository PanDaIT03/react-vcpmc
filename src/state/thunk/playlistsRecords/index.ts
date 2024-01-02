import { createAsyncThunk } from "@reduxjs/toolkit";
import { editPlaylistAPI, savePlaylist } from "~/api/playlist";

import {
  PlaylistsRecords,
  RemoveRecordParam,
  deletePlaylistRecordsAPI,
  editRecordsInPlaylist,
  getPlaylistsRecords,
  removeRecordAPI,
  savePlaylistRecordsAPI,
} from "~/api/playlistsRecords";
import { getPlaylistListAction } from "~/state/thunk/playlist";
import { setRecordsOfPlaylist } from "~/state/reducer/playlistsRecords";
import { IPLaylist } from "~/types/PlaylistType";

export const getPlaylistsRecordsList = createAsyncThunk(
  "playlistsRecords/getPlaylistsRecordsList",
  async () => {
    return await getPlaylistsRecords();
  }
);

export const removeRecord = createAsyncThunk(
  "playlistsRecords/removeRecord",
  async ({ recordList, recordId, playlistRecordId }: RemoveRecordParam) => {
    return await removeRecordAPI({ recordList, recordId, playlistRecordId });
  }
);

export const editPlaylist = createAsyncThunk(
  "playlistsRecords/editRecord",
  async (
    {
      recordList,
      playlistRecordId,
      playlist,
      navigate,
    }: RemoveRecordParam & {
      playlist: Pick<
        IPLaylist,
        "description" | "categories" | "title" | "mode" | "docId"
      >;
      navigate: () => void;
    },
    thunkAPI
  ) => {
    await thunkAPI.dispatch(
      removeRecord({
        recordList: recordList,
        playlistRecordId: playlistRecordId,
      })
    );
    await editPlaylistAPI({ ...playlist });
    await thunkAPI.dispatch(getPlaylistListAction());
    await thunkAPI.dispatch(getPlaylistsRecordsList());

    navigate();
  }
);

export const editRecordsPlaylist = createAsyncThunk(
  "playlistsRecords/editRecordsPlaylist",
  async (
    {
      playlistRecordId,
      recordList,
      navigate,
    }: Omit<RemoveRecordParam, "recordId"> & { navigate: () => void },
    thunkAPI
  ) => {
    await editRecordsInPlaylist({ playlistRecordId, recordList });
    await thunkAPI.dispatch(getPlaylistsRecordsList());

    navigate();
  }
);

export type SavePlaylistRecordsParams = {
  playlist: Omit<IPLaylist, "id" | "createdBy"> & { createdBy: string };
  playlistRecords: Omit<PlaylistsRecords, "id" | "playlistsId">;
};

export const savePlaylistRecords = createAsyncThunk(
  "playlistsRecords/savePlaylistRecords",
  async (
    {
      playlist,
      playlistRecords,
      navigate,
    }: SavePlaylistRecordsParams & { navigate: () => void },
    thunkAPI
  ) => {
    const playlistId: string = await savePlaylist({ playlist });
    const playslitRecordsData = {
      playlistsId: playlistId,
      recordsId: playlistRecords.recordsId,
    };
    await savePlaylistRecordsAPI({ data: playslitRecordsData });
    thunkAPI.dispatch(setRecordsOfPlaylist([]));

    navigate();
  }
);

export const deletePlaylistRecords = createAsyncThunk(
  "playlistsRecords/deletePlaylistRecords",
  async ({
    playlistRecordsId,
    navigate,
  }: {
    playlistRecordsId: string;
    navigate: () => void;
  }) => {
    await deletePlaylistRecordsAPI({ playlistRecordsId });
    navigate();
  }
);
