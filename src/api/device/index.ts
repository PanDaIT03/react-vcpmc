import { collection, getDocs, query } from "firebase/firestore";
import { fireStoreDatabase } from "~/config/firebase";
import { IDevice } from "~/types/Device";

export const getDevices = async () => {
  const queryStmt = query(collection(fireStoreDatabase, "devices"));
  const querySnapshot = await getDocs(queryStmt);

  const devices: IDevice[] = querySnapshot.docs.map((doc) => {
    return {
      docId: doc.id,
      SKUID: doc.data().SKUID,
      expirationDate: doc.data().expirationDate,
      format: doc.data().format,
      imageURL: doc.data().imageURL,
      lastestVersion: doc.data().lastestVersion,
      macAddress: doc.data().macAddress,
      memory: doc.data().memory,
      name: doc.data().name,
      note: doc.data().note,
      operatingLocation: doc.data().operatingLocation,
      password: doc.data().password,
      status: doc.data().status,
      unitsUsed: doc.data().unitsUsed,
      userName: doc.data().userName,
    };
  });

  return devices;
};
