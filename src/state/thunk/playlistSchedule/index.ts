import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDevices } from "~/api/device";
import { getPlaylist } from "~/api/playlist";
import {
  getPlaylistChedules,
  getScheduleDevices,
  removeSchedulePlayback,
} from "~/api/playlistSchedule";
import { IDevice } from "~/types/Device";
import { IPlaylistSchedule } from "~/types/PlaylistSchedule";

const initialPlaylistSchedule: IPlaylistSchedule = {
  docId: "",
  name: "",
  playbackTime: "",
  playlistsIds: [],
  devices: [],
};

export const getPlaylistScheduleAction = createAsyncThunk(
  "playlistSchedule/getplaylistSchedule",
  async (_, thunkAPI) => {
    const playlistSchedules = await getPlaylistChedules();
    const playlist = await getPlaylist();
    const devices = await getDevices();
    const scheduleDevices = await getScheduleDevices();

    let playlistScheduleDetails: IPlaylistSchedule[] = [];

    scheduleDevices.forEach((scheduleDevice) => {
      let list =
        playlistSchedules.find((item) => {
          if (item.docId === scheduleDevice.schedulesId) {
            const playlistDetails = item.playlistsIds.map((i) => {
              const playlistTitle = playlist.find(
                (playlistItem) => playlistItem.docId === i.playlistsId
              )?.title;

              if (playlistTitle) i.playlistTitle = playlistTitle;
              return i;
            });

            return {
              ...item,
              playlistsId: playlistDetails,
            };
          }
        }) || initialPlaylistSchedule;

      const device = scheduleDevice.devicesIds.map((item) => {
        return (
          devices.find((device) => device.docId === item) || ({} as IDevice)
        );
      });

      const details: IPlaylistSchedule = {
        ...list,
        devices: device,
      };
      playlistScheduleDetails.push({ ...details });
    });

    return playlistScheduleDetails;
  }
);

export const removeSchedulePlaybackAction = createAsyncThunk(
  "playlistSchedule/removeplaylistSchedule",
  async (data: Pick<IPlaylistSchedule, "docId" | "playlistsIds">, thunkAPI) => {
    await removeSchedulePlayback(data).then(() =>
      thunkAPI.dispatch(getPlaylistScheduleAction())
    );
  }
);
