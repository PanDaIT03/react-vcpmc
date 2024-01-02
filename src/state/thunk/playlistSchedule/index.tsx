import { createAsyncThunk } from "@reduxjs/toolkit";
import { getSchedules, saveSchedulePlaylist } from "~/api/playlistSchedule";

interface PlaybackCycle {
    time: string[];
    day: string
};

export const getScheduleList = createAsyncThunk(
    'playlistSchedule/getScheduleList',
    async () => {
        return await getSchedules();
    }
);

export type UpdateTimeScheduleParams = {
    id: string,
    playlistsIds: {
        playbackCycle: PlaybackCycle[];
        playlistsId: string;
    }[];
    navigate: () => void;
    name: string;
    playbackTime: string;
};

export const savePlaylistSchedule = createAsyncThunk(
    'playlistSchedule/savePlaylistSchedule',
    async (data: UpdateTimeScheduleParams) => {
        const { id, playlistsIds, navigate, name, playbackTime } = data;

        await saveSchedulePlaylist({ id: id, playlistsIds: playlistsIds, name, playbackTime });
        navigate();
    }
);