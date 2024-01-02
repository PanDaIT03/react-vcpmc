import { IPLaylist } from "../PlaylistType";
import { PlaylistRecordDetail } from "../PlaylistsRecords";

export interface SchedulePlaylistDetail {
  id: string;
  name: string;
  playbackTime: string;
  playlist: SchedulePlaylist[];
}

export interface SchedulePlaylist {
  playbackCycle: PlaybackCycle[];
  playlistDetail: IPLaylist;
}

export interface PlaybackCycle {
  day: string;
  time: string[];
}

interface OwnPlaylist {
  playbackCycle: PlaybackCycle[];
  playlistsId: string;
}

export interface PlaylistSchedule {
  id: string;
  name: string;
  playbackTime: string;
  playlistsIds: OwnPlaylist[];
}

export interface UpdateTimeScheduleParams {
  id: string;
  playlistsIds: {
    playbackCycle: PlaybackCycle[];
    playlistsId: string;
  }[];
  navigate: () => void;
  name: string;
  playbackTime: string;
}

export type PlaylistScheduleDetail = {
  playbackCycle: PlaybackCycle[];
  playlist: PlaylistRecordDetail;
};
