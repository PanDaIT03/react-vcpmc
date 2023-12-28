import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { fireStoreDatabase } from "~/config/firebase";
import { IPlaylistSchedule, IScheduleDevices } from "~/types/PlaylistSchedule";

export const getPlaylistChedules = async () => {
  const queryStmt = query(
    collection(fireStoreDatabase, "playlistSchedules"),
    orderBy("name", "asc")
  );
  const querySnapshot = await getDocs(queryStmt);

  const playlistSchedules: Omit<IPlaylistSchedule, "devices">[] =
    querySnapshot.docs.map((doc) => {
      return {
        docId: doc.id,
        name: doc.data().name,
        playbackTime: doc.data().playbackTime,
        playlistsIds: doc.data().playlistsIds,
      };
    });

  return playlistSchedules;
};

export const getScheduleDevices = async () => {
  const queryStmt = query(collection(fireStoreDatabase, "schedule_devices"));
  const querySnapshot = await getDocs(queryStmt);

  const scheduleDevices: IScheduleDevices[] = querySnapshot.docs.map((doc) => {
    return {
      docId: doc.id,
      devicesIds: doc.data().devicesIds,
      schedulesId: doc.data().schedulesId,
    };
  });

  return scheduleDevices;
};

export const removeSchedulePlayback = async (
  data: Pick<IPlaylistSchedule, "docId" | "playlistsIds">
) => {
  const { docId, playlistsIds } = data;

  const collectionRef = collection(fireStoreDatabase, "playlistSchedules");
  const scheduleUpdate = {
    playlistsIds: playlistsIds,
  };

  const scheduleRef = doc(collectionRef, docId);
  await updateDoc(scheduleRef, scheduleUpdate);
};
