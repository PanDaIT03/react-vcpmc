import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import { fireStoreDatabase } from "~/config/firebase";
import { IContract } from "~/types";

export const getContracts = async () => {
  const queryStmt = query(
    collection(fireStoreDatabase, "contract"),
    orderBy("status", "asc")
  );
  const querySnapshot = await getDocs(queryStmt);

  const contracts: IContract[] = querySnapshot.docs.map((doc) => {
    return {
      docId: doc.id,
      authorized: doc.data().authorized,
      authorizingLegalEntity: doc.data().authorizingLegalEntity,
      censored: doc.data().censored,
      contractCode: doc.data().contractCode,
      contractTypesId: doc.data().contractTypesId,
      createdBy: doc.data().createdBy,
      customer: doc.data().customer,
      dateCreated: doc.data().dateCreated,
      effectiveDate: doc.data().effectiveDate,
      expirationDate: doc.data().expirationDate,
      ownerShips: doc.data().ownerShips,
      reason: doc.data().reason,
      status: doc.data().status,
    };
  });

  return contracts;
};

export const editContract = async (
  toDate: string,
  status: string,
  id: string
) => {
  const collectionRef = collection(fireStoreDatabase, "contract");
  const updateExpire = {
    expirationDate: toDate,
    status: status,
  };

  const contractRef = doc(collectionRef, id);
  await updateDoc(contractRef, updateExpire);
};

export const cancleContract = async (
  id: string,
  reason: string,
  status: string
) => {
  const collectionRef = collection(fireStoreDatabase, "contract");
  const cancleContract = {
    reason: reason,
    status: status
  };

  const contractRef = doc(collectionRef, id);
  await updateDoc(contractRef, cancleContract);
};
