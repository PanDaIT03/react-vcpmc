import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { fireStoreDatabase } from "~/config/firebase";
import { UpdateTimeScheduleParams } from "~/types/PlaylistSchedule";

export const getSchedules = async () => {
  const resultSnapshot = getDocs(
    collection(fireStoreDatabase, "playlistSchedules")
  );

  return (await resultSnapshot).docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    playbackTime: doc.data().playbackTime,
    playlistsIds: doc.data().playlistsIds,
  }));
};

export const saveSchedulePlaylist = async (
  data: Omit<UpdateTimeScheduleParams, "navigate">
) => {
  console.log(data);
  const { id } = data;

  if (data.id !== "")
    return await updateDoc(
      doc(fireStoreDatabase, `playlistSchedules`, `${id}`),
      { ...data }
    );

  return await addDoc(collection(fireStoreDatabase, "playlistSchedules"), {
    ...data,
  });
};
