import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { fireStoreDatabase } from "~/config/firebase";
import { IRecord } from "~/types";
import { IPLaylist } from "~/types/PlaylistType";
// import { deleteService, updateService } from "~/service";

export type PlaylistsRecords = {
  id: string;
  playlistsId: string;
  recordsId: Array<string>;
};

export type PlaylistRecordDetail = {
  playlist: Omit<IPLaylist, "docId"> & { imageURL: string };
  records: Array<IRecord>;
} & {
  quantity: number;
  totalTime: string;
  playlistId: string;
  playlistRecordId: string;
};

export const getPlaylistsRecords = async () => {
  const resultSnapshot = getDocs(
    collection(fireStoreDatabase, "playlists_records")
  );

  return (await resultSnapshot).docs.map((doc) => ({
    id: doc.id,
    recordsId: doc.data().recordsId,
    playlistsId: doc.data().playlistsId,
  }));
};

export type RemoveRecordParam = {
  recordList: Array<string>;
  recordId?: string;
  playlistRecordId: string;
};

export const removeRecordAPI = async ({
  recordList,
  recordId,
  playlistRecordId,
}: RemoveRecordParam) => {
  let newRecordList = recordList;

  if (typeof recordId !== "undefined")
    newRecordList = recordList.filter((record: string) => record !== recordId);

  await updateDoc(
    doc(fireStoreDatabase, `playlists_records`, `${playlistRecordId}`),
    { ...newRecordList }
  );
};

export const editRecordsInPlaylist = async ({
  playlistRecordId,
  recordList,
}: Omit<RemoveRecordParam, "recordId">) => {
  await updateDoc(
    doc(fireStoreDatabase, "playlists_records", `${playlistRecordId}`),
    { ...recordList }
  );
};

export const savePlaylistRecordsAPI = async ({
  data,
}: {
  data: Omit<PlaylistsRecords, "id">;
}) => {
  await addDoc(collection(fireStoreDatabase, "playlists_records"), { ...data });
};

export const deletePlaylistRecordsAPI = async ({
  playlistRecordsId,
}: {
  playlistRecordsId: string;
}) => {
  await deleteDoc(
    doc(fireStoreDatabase, "playlists_records", `${playlistRecordsId}`)
  );
};
