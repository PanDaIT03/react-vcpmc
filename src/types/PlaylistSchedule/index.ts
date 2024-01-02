import { IDevice } from "../Device";
import { IPlaylistRecordDetail } from "../Playlist";

export interface IPlaybackCycle {
  day: string;
  time: Array<string>;
}

interface IPlaylistsSchedule {
  playbackCycle: IPlaybackCycle[];
  playlistsId: string;
  playlistTitle?: string;
}

export interface IPlaylistSchedule {
  docId: string;
  name: string;
  playbackTime: string;
  playlistsIds: Array<IPlaylistsSchedule>;
  devices: IDevice[];
}

export interface IScheduleDevices {
  docId: string;
  devicesIds: Array<string>;
  schedulesId: string;
}

export interface IPlaylistScheduleDetail {
  playbackCycle: IPlaybackCycle[];
  playlist: IPlaylistRecordDetail;
}
