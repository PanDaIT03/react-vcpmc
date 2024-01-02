import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  addPlaylist,
  addPlaylistsRecords,
  getPlaylist,
  getPlaylistRecords,
  removePlaylist,
  removePlaylistRecord,
  removePlaylistsRecords,
  updatePlaylist,
  updatePlaylistsRecords,
} from "~/api/playlist";
import { getCategories, getRecords } from "~/api/record";
import { getUser } from "~/api/user";
import { IRecord } from "~/types";
import { IPLaylist } from "~/types/Playlist";

export interface UpdatePlaylist {
  docId: string;
  imageURL: string;
  title: string;
  description: string;
}

export const getPlayListAction = createAsyncThunk(
  "playlist/getPlaylist",
  async (_, thunkAPI) => {
    const playlist = await getPlaylist();
    const records = await getRecords();
    const playlistRecords = await getPlaylistRecords();
    const categories = await getCategories();
    const users = await getUser();

    let playlistDetails: IPLaylist[] = [];

    playlistRecords.forEach((playlistRecord) => {
      let list =
        playlist.find((item) => playlistRecord.playlistsId === item.docId) ||
        ({} as IPLaylist);

      let record = playlistRecord.recordsId.map((item) => {
        let record =
          records.find((record) => record.docId === item) || ({} as IRecord);

        categories.forEach((category) => {
          if (record.categoriesId === category.docId)
            record.category = category.name;
        });

        return record;
      });

      let details: IPLaylist = {
        ...list,
        playlistsRecordsId: playlistRecord.docId,
        records: record,
        categories: [],
      };
      playlistDetails.push({ ...details });
    });

    playlistDetails.forEach((playlist) => {
      playlist.categoriesId.forEach((item) => {
        let category = categories.find((category) => category.docId === item);
        if (typeof category !== "undefined")
          playlist.categories = [...playlist.categories, category.name];
      });

      let user = users.find((user) => user.docId === playlist.createdBy);
      if (typeof user !== "undefined")
        playlist.createdBy = user.firstName + " " + user.lastName;
    });

    return playlistDetails;
  }
);

export const removePlaylistRecordAction = createAsyncThunk(
  "playlist/removePlaylistRecord",
  async (playlistDetails: IPLaylist, thunkAPI) => {
    const { playlistsRecordsId, records } = playlistDetails;

    let recordsId: string[] = [];
    records.forEach((record) => recordsId.push(record.docId));

    const data = {
      playlistsRecordsId: playlistsRecordsId,
      recordsId: recordsId,
    };

    return await removePlaylistRecord(data).then(() =>
      thunkAPI.dispatch(getPlayListAction())
    );
  }
);

export const updatePlaylistAction = createAsyncThunk(
  "playlist/updatePlaylist",
  async (data: UpdatePlaylist, thunkAPI) => {
    return await updatePlaylist(data);
  }
);

export const addPlaylistAction = createAsyncThunk(
  "playlist/addPlaylistRecord",
  async (data: Omit<IPLaylist, "categories" | "docId" | "playlistsRecordsId">) => {
    const {
      title,
      records,
      categoriesId,
      createdBy,
      createdDate,
      description,
      imageURL,
      mode,
    } = data;

    let addPlaylistData = {
        title: title,
        categoriesId: categoriesId,
        createdBy: createdBy,
        createdDate: createdDate,
        description: description,
        imageURL: imageURL,
        mode: mode,
      },
      recordsId: string[] = [];
    records.map((record) => recordsId.push(record.docId));

    let newPlaylistId = await addPlaylist(addPlaylistData);

    if (newPlaylistId)
      await addPlaylistsRecords({
        playlistsId: newPlaylistId,
        recordsId: recordsId,
      });
  }
);

export const updatePlaylistsRecordsAction = createAsyncThunk(
  "playlist/updatePlaylistsRecords",
  async (
    data: {
      playlistsId: string;
      records: IRecord[];
    },
    thunkAPI
  ) => {
    const { playlistsId, records } = data;

    let recordsId: string[] = [];
    records.map((record) => recordsId.push(record.docId));

    return await updatePlaylistsRecords({
      playlistsId: playlistsId,
      recordsId: recordsId,
    });
  }
);

export const deletePlaylistAction = createAsyncThunk(
  "playlist/deletePlaylistsRecords",
  async (docId: string) => {
    if (docId === "") return;
    await removePlaylist(docId);
    await removePlaylistsRecords(docId);
  }
);
