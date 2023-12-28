import { IDevice } from "../Device";

export interface IPlaybackCycle {
  day: string;
  time: Array<string>;
}

interface IPlaylistsDetails {
  playbackCycle: Array<IPlaybackCycle>;
  playlistsId: string;
  playlistTitle?: string;
}

export interface IPlaylistSchedule {
  docId: string;
  name: string;
  playbackTime: string;
  playlistsIds: Array<IPlaylistsDetails>;
  devices: IDevice[];
}

export interface IScheduleDevices {
  docId: string;
  devicesIds: Array<string>;
  schedulesId: string;
}
