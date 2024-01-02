import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { fireStoreDatabase } from "~/config/firebase";
import { IDevice } from "~/types/DeviceType";

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

export const changeStatusDeviceById = async ({
  data,
}: {
  data: Array<Pick<IDevice, "status" | "docId">>;
}) => {
  const batch = writeBatch(fireStoreDatabase);

  data.forEach((device) => {
    batch.update(doc(fireStoreDatabase, "devices", device.docId), {
      status: device.status,
    });
  });

  await batch.commit();
};

export const updateDeviceById = async ({
  data,
}: {
  data: Pick<
    IDevice,
    | "docId"
    | "status"
    | "SKUID"
    | "macAddress"
    | "name"
    | "operatingLocation"
    | "userName"
  >;
}) => {
  const updateDevice = {
    status: data.status,
    SKUID: data.SKUID,
    macAddress: data.macAddress,
    name: data.name,
    operatingLocation: data.operatingLocation,
    userName: data.userName,
  };

  await updateDoc(
    doc(fireStoreDatabase, "devices", `${data.docId}`),
    updateDevice
  );
};

export const restoreMemoryById = async (
  data: Pick<IDevice, "docId" | "memory">
) => {
  await updateDoc(doc(fireStoreDatabase, "devices", `${data.docId}`), {
    memory: data.memory,
  });
};

export const changePasswordDeviceById = async (
  data: Pick<IDevice, "docId" | "password">
) => {
  await updateDoc(doc(fireStoreDatabase, "devices", `${data.docId}`), {
    password: data.password,
  });
};

export const addDeviceAPI = async (
  data: Omit<IDevice, "lastestVersion" | "docId">
) => {
  await addDoc(collection(fireStoreDatabase, "devices"), data);
};

export const deleteDevicesAPI = async (data: Array<Pick<IDevice, "docId">>) => {
  const batch = writeBatch(fireStoreDatabase);

  data.forEach((device) => {
    batch.delete(doc(fireStoreDatabase, "devices", device.docId));
  });

  await batch.commit();
};
