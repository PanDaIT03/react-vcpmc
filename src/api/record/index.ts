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

export const getRecords = async (contractId: string) => {
  const queryStmt = query(
      collection(fireStoreDatabase, "records"),
      where("contractId", "==", `${contractId}`)
    ),
    querySnapshot = await getDocs(queryStmt);

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

export const approvalRecords = async (recordId: string, status: string) => {
  const collectionRef = collection(fireStoreDatabase, "records");
  const updateRecords = {
    contractStatus: status,
  };

  const userRef = doc(collectionRef, recordId);
  await updateDoc(userRef, updateRecords);
};
