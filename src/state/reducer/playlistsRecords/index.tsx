import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

import { PlaylistRecordDetail, PlaylistsRecords } from "~/types/PlaylistsRecords";
import { IRecord } from "~/types/RecordType";
import {
    editPlaylist,
    editRecordsPlaylist,
    getPlaylistsRecordsList,
    removeRecord,
    savePlaylistRecords,
} from "~/state/thunk/playlistsRecords";
import { IPLaylist } from "~/types/PlaylistType";

export type PlaylistRecordInitialState = {
    playlistsRecords: Array<PlaylistsRecords>;
    loading: boolean;
    playlistsRecordsDetail: Array<PlaylistRecordDetail>;
    recordsOfPlaylist: Array<IRecord>;
};

const initialState: PlaylistRecordInitialState = {
    playlistsRecords: [],
    loading: false,
    playlistsRecordsDetail: [],
    recordsOfPlaylist: [],
};

const playlistRecordsSlice = createSlice({
    name: "playlistsRecords",
    initialState,
    reducers: {
        setPlaylistsRecordsDetail: (state, action) => {
            state.playlistsRecordsDetail = action.payload;
        },
        getPlaylistsRecordsDetail: (state, action) => {
            const { playlist, playlistsRecords, record } = action.payload;

            let playlistRecordList: Array<PlaylistRecordDetail> =
                [] as Array<PlaylistRecordDetail>;

            playlistsRecords.playlistsRecords.forEach(
                (playlistRecord: PlaylistsRecords) => {
                    let playlistItem: IPLaylist =
                        playlist.playList.find(
                            (playlistItem: IPLaylist) =>
                                playlistRecord.playlistsId === playlistItem.docId
                        ) || ({} as IPLaylist);

                    let recordList: Array<IRecord> = playlistRecord.recordsId.map((recordId) => {
                        return (
                            record.records.find((record: IRecord) =>
                                recordId === record.docId) || ({} as IRecord)
                        );
                    });

                    let momentTime = moment("00000000", "hh:mm:ss")
                        .utcOffset(0)
                        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

                    let quantity = recordList.reduce((total: number, record: IRecord) => {
                        let timeSplit = record.time.split(":");

                        momentTime
                            .add("minutes", timeSplit[0])
                            .add("seconds", timeSplit[1]);
                        return total + 1;
                    }, 0);

                    playlistRecordList.push({
                        playlist: { ...playlistItem },
                        records: recordList,
                        playlistId: playlistItem.docId,
                        playlistRecordId: playlistRecord.id,
                        quantity: quantity,
                        totalTime: momentTime.toISOString().split("T")[1].slice(0, 8),
                    });

                    state.playlistsRecordsDetail = playlistRecordList;
                }
            );
        },
        setRecordsOfPlaylist: (state, action) => {
            console.log(action.payload);

            state.recordsOfPlaylist = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getPlaylistsRecordsList.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getPlaylistsRecordsList.fulfilled, (state, action) => {
            state.loading = false;
            state.playlistsRecords = action.payload;
        });
        builder.addCase(getPlaylistsRecordsList.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(removeRecord.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(removeRecord.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(removeRecord.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(editPlaylist.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(editPlaylist.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(editPlaylist.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(editRecordsPlaylist.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(editRecordsPlaylist.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(editRecordsPlaylist.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(savePlaylistRecords.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(savePlaylistRecords.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(savePlaylistRecords.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
    },
});

export const playlistsRecordsReducer = playlistRecordsSlice.reducer;

export const {
    setPlaylistsRecordsDetail,
    getPlaylistsRecordsDetail,
    setRecordsOfPlaylist,
} = playlistRecordsSlice.actions;
