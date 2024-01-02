import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { fireStoreDatabase } from "~/config/firebase";
import * as firebase from "firebase/firestore";

import { UpdatePlaylist } from "~/state/thunk/playlist";
import { IPLaylist, IPlaylistRecords } from "~/types/PlaylistType";

const getDocIdByField = async (field: string, param: number | string) => {
  const queryStmt = query(
      collection(fireStoreDatabase, "playlists_records"),
      where(`${field}`, "==", typeof param === "string" ? `${param}` : param)
    ),
    querySnapshot = await getDocs(queryStmt);

  if (querySnapshot.docs.map((doc) => doc.data()).length !== 0)
    return querySnapshot.docs.map((doc) => doc.id)[0];
};

export const getPlaylist = async () => {
  const queryStmt = query(collection(fireStoreDatabase, "playlists"));
  const querySnapshot = await getDocs(queryStmt);

  const playlist: Omit<
    IPLaylist,
    "categories" | "records" | "playlistsRecordsId"
  >[] = querySnapshot.docs.map((doc) => {
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

export const getPlaylistUser = async () => {
  const resultSnapshot = await getDocs(
    collection(fireStoreDatabase, "playlists")
  );
  const userList = await getDocs(collection(fireStoreDatabase, "users"));
  const roleList = await getDocs(collection(fireStoreDatabase, "roles"));

  return resultSnapshot.docs.map((doc) => {
    const user = userList.docs.find((user) => user.id === doc.data().createdBy);
    const role = roleList.docs.find((role) => role.id === user?.data().rolesId);

    return {
      id: doc.id,
      title: doc.data().title,
      categories: doc.data().categories,
      createdDate: doc.data().createdDate,
      createdBy: {
        avatar: user?.data().avatar || "",
        bank: user?.data().bank || "",
        bankNumber: user?.data().bankNumber || "",
        dateOfBirth: user?.data().dateOfBirth || "",
        dateRange: user?.data().dateRange || "",
        email: user?.data().email || "",
        firstName: user?.data().firstName || "",
        gender: user?.data().gender || "",
        idNumber: user?.data().idNumber || "",
        issuedBy: user?.data().issuedBy || "",
        lastName: user?.data().lastName || "",
        nationality: user?.data().nationality || "",
        password: user?.data().password || "",
        phoneNumber: user?.data().phoneNumber || "",
        residence: user?.data().residence || "",
        rolesId: user?.data().rolesId || "",
        taxCode: user?.data().taxCode || "",
        userName: user?.data().userName || "",
        role: role
          ? { id: role.id, name: role.data().name }
          : { id: "", name: "" },
        id: user?.id || "",
      },
      description: doc.data().description,
      mode: doc.data().mode,
      imageURL: doc.data().imageURL,
    };
  });
};

export const getPlaylistRecords = async () => {
  const queryStmt = query(collection(fireStoreDatabase, "playlists_records"));
  const querySnapshot = await getDocs(queryStmt);

  const playlistRecords: IPlaylistRecords[] = querySnapshot.docs.map((doc) => {
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

export const updatePlaylistsRecords = async (data: {
  playlistsId: string;
  recordsId: string[];
}) => {
  const { playlistsId, recordsId } = data;
  const collectionRef = collection(fireStoreDatabase, "playlists_records");

  const updatePlaylistsRecords = {
      recordsId: recordsId,
    },
    docId = await getDocIdByField("playlistsId", playlistsId);

  const playlistsRecordsRef = doc(collectionRef, docId);
  await updateDoc(playlistsRecordsRef, updatePlaylistsRecords);
};

export const addPlaylist = async (
  data: Omit<
    IPLaylist,
    "categories" | "docId" | "records" | "playlistsRecordsId"
  >
) => {
  const collectionRef = collection(fireStoreDatabase, "playlists");
  const playlistData = {
    ...data,
    categories: data.categoriesId,
  };

  return (await addDoc(collectionRef, playlistData)).id;
};

export const addPlaylistsRecords = async (
  data: Omit<IPlaylistRecords, "docId">
) => {
  const collectionRef = collection(fireStoreDatabase, "playlists_records");
  const playlistData = { ...data };

  return (await addDoc(collectionRef, playlistData)).id;
};

export const removePlaylist = async (docId: string) => {
  const collectionRef = doc(fireStoreDatabase, "playlists", docId);
  firebase.deleteDoc(collectionRef);
};

export const removePlaylistsRecords = async (playlistsId: string) => {
  const queryStmt = query(
      collection(fireStoreDatabase, "playlists_records"),
      where("playlistsId", "==", `${playlistsId}`)
    ),
    querySnapshot = await getDocs(queryStmt);

  querySnapshot.forEach((doc) => {
    firebase.deleteDoc(doc.ref);
  });
};

export const editPlaylistAPI = async ({
  description,
  categories,
  title,
  mode,
  docId,
}: Pick<
  IPLaylist,
  "description" | "categories" | "title" | "mode" | "docId"
>) => {
  await updateDoc(doc(fireStoreDatabase, "playlists", `${docId}`), {
    description,
    categories,
    title,
    mode,
  });
};

export const savePlaylist = async ({
  playlist,
}: {
  playlist: Omit<IPLaylist, "docId" | "createdBy"> & { createdBy: string };
}) => {
  return (
    await addDoc(collection(fireStoreDatabase, "playlists"), { ...playlist })
  ).id;
};