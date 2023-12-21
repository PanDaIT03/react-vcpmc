import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getPlaylist,
  getPlaylistRecords,
  removePlaylistRecord,
  updatePlaylist,
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
    return await updatePlaylist(data).then(() =>
      thunkAPI.dispatch(getPlayListAction())
    );
  }
);
