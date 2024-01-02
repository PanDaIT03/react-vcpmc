import { IRecord } from "../RecordType";

export interface IPLaylist {
  docId: string;
  playlistsRecordsId: string;
  categoriesId: Array<string>;
  records: IRecord[];
  createdBy: string;
  createdDate: string;
  description: string;
  imageURL: string;
  mode: string;
  title: string;
  categories: Array<string>;
}

export interface IPlaylistRecords {
  docId: string;
  playlistsId: string;
  recordsId: Array<string>;
}

export type IPlaylistRecordDetail = {
  playlist: Omit<IPLaylist, "docId">;
  quantity: number;
  totalTime: string;
  playlistId: string;
  playlistRecordId: string;
};
