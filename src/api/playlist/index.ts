import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import { fireStoreDatabase } from "~/config/firebase";
import { UpdatePlaylist } from "~/state/thunk/playlist";

import { IPLaylist, PlaylistRecords } from "~/types/Playlist";

export const getPlaylist = async () => {
  const queryStmt = query(collection(fireStoreDatabase, "playlists"));
  const querySnapshot = await getDocs(queryStmt);

  const playlist: Omit<IPLaylist, "categories" | "records">[] =
    querySnapshot.docs.map((doc) => {
      return {
        docId: doc.id,
        categoriesId: doc.data().categories,
        createdBy: doc.data().createdBy,
        createdDate: doc.data().createdDate,
        description: doc.data().description,
        imageURL: doc.data().imageURL,
        mode: doc.data().mode,
        title: doc.data().title,
      };
    });

  return playlist;
};

export const getPlaylistRecords = async () => {
  const queryStmt = query(collection(fireStoreDatabase, "playlists_records"));
  const querySnapshot = await getDocs(queryStmt);

  const playlistRecords: PlaylistRecords[] = querySnapshot.docs.map((doc) => {
    return {
      docId: doc.id,
      playlistsId: doc.data().playlistsId,
      recordsId: doc.data().recordsId,
    };
  });

  return playlistRecords;
};

export const removePlaylistRecord = async (data: {
  playlistsRecordsId: string | undefined;
  recordsId: string[];
}) => {
  const { playlistsRecordsId, recordsId } = data;
  if (typeof playlistsRecordsId === "undefined") return;

  const collectionRef = collection(fireStoreDatabase, "playlists_records");
  const updatePlaylistRecords = {
    recordsId: recordsId,
  };

  const playlistRef = doc(collectionRef, playlistsRecordsId);
  await updateDoc(playlistRef, updatePlaylistRecords);
};

export const updatePlaylist = async (data: UpdatePlaylist) => {
  const { docId, imageURL, title, description } = data;

  const collectionRef = collection(fireStoreDatabase, "playlists");
  const updatePlaylist = {
    imageURL: imageURL,
    title: title,
    description: description,
  };

  const playlistRef = doc(collectionRef, docId);
  await updateDoc(playlistRef, updatePlaylist);
};
