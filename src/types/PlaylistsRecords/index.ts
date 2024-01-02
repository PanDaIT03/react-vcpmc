import { IPLaylist } from "../PlaylistType";
import { IRecord } from "../RecordType";

export type PlaylistsRecords = {
  id: string;
  playlistsId: string;
  recordsId: Array<string>;
};

export type PlaylistRecordDetail = {
  playlist: Omit<IPLaylist, "id"> & { imageURL: string };
  records: Array<IRecord>;
} & {
  quantity: number;
  totalTime: string;
  playlistId: string;
  playlistRecordId: string;
};