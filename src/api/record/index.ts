import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { fireStoreDatabase } from "~/config/firebase";
import { ICategory, IRecord } from "~/types";
import { OwnRecord } from "~/types/EntrustmentContractType";

export const getRecords = async (contractId?: string) => {
  let queryStmt;

  if (contractId) {
    queryStmt = query(
      collection(fireStoreDatabase, "records"),
      where("contractId", "==", `${contractId}`)
    );
  } else queryStmt = query(collection(fireStoreDatabase, "records"));

  const querySnapshot = await getDocs(queryStmt);

  const records: IRecord[] = querySnapshot.docs.map((doc) => {
    return {
      docId: doc.id,
      imageURL: doc.data().imageURL,
      ISRCCode: doc.data().ISRCCode,
      approvalDate: doc.data().approvalDate,
      approvalBy: doc.data().approvalBy,
      audioLink: doc.data().audioLink,
      author: doc.data().author,
      categoriesId: doc.data().categoriesId,
      contractId: doc.data().contractId,
      etmContractsId: doc.data().etmContractsId,
      contractStatus: doc.data().contractStatus,
      createdBy: doc.data().createdBy,
      createdDate: doc.data().createdDate,
      format: doc.data().format,
      nameRecord: doc.data().nameRecord,
      producer: doc.data().producer,
      singer: doc.data().singer,
      time: doc.data().time,
      expirationDate: doc.data().expirationDate,
      status: doc.data().status,
    };
  });

  return records;
};

export const getCategories = async () => {
  const queryStmt = query(collection(fireStoreDatabase, "categories")),
    querySnapshot = await getDocs(queryStmt);

  const categories: ICategory[] = querySnapshot.docs.map((doc) => {
    return {
      docId: doc.id,
      name: doc.data().name,
    };
  });

  return categories;
};

export const getRecordList = async () => {
  const resultSnapshot = await getDocs(
    collection(fireStoreDatabase, "records")
  );

  return resultSnapshot.docs.map((doc) => ({
    docId: doc.id,
    imageURL: doc.data().imageURL,
    ISRCCode: doc.data().ISRCCode,
    approvalDate: doc.data().approvalDate,
    approvalBy: doc.data().approvalBy,
    audioLink: doc.data().audioLink,
    author: doc.data().author,
    categoriesId: doc.data().categoriesId,
    contractId: doc.data().contractId,
    createdBy: doc.data().createdBy,
    createdDate: doc.data().createdDate,
    expirationDate: doc.data().expirationDate,
    format: doc.data().format,
    nameRecord: doc.data().nameRecord,
    producer: doc.data().producer,
    singer: doc.data().singer,
    time: doc.data().time,
    etmContractsId: doc.data().etmContractsId,
  }));
};

export const approvalRecords = async (
  recordId: string,
  status: string,
  approvalBy: string,
  approvalDate: string
) => {
  const collectionRef = collection(fireStoreDatabase, "records");
  const updateRecords = {
    status: status,
    approvalBy: approvalBy,
    approvalDate: approvalDate,
  };

  const recordRef = doc(collectionRef, recordId);
  await updateDoc(recordRef, updateRecords);
};

export const approvalContractRecords = async (
  recordId: string,
  status: string
) => {
  const collectionRef = collection(fireStoreDatabase, "records");
  const updateRecords = {
    contractStatus: status,
  };

  const recordRef = doc(collectionRef, recordId);
  await updateDoc(recordRef, updateRecords);
};

export const updateRecord = async (
  recordId: string,
  data: Pick<IRecord, "nameRecord" | "ISRCCode" | "singer" | "author" | "producer">
) => {
  if (recordId === "") return;

  const collectionRef = collection(fireStoreDatabase, "records");
  const updateRecord = { ...data };

  const recordRef = doc(collectionRef, recordId);
  await updateDoc(recordRef, updateRecord);
};
