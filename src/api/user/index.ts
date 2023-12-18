import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { sendPasswordResetEmail } from "firebase/auth";
import { auth, fireStoreDatabase } from "../../config/firebase";
import { IUser } from "../../types";

export const checkLogin = async ({
  userName,
  password,
}: Pick<IUser, "userName" | "password">) => {
  const queryStmt = query(
      collection(fireStoreDatabase, "users"),
      where("userName", "==", `${userName}`),
      where("password", "==", `${password}`)
    ),
    querySnapshot = await getDocs(queryStmt);

  if (querySnapshot.docs.map((doc) => doc.data()).length !== 0)
    return querySnapshot.docs.map((doc) => doc.id)[0];
  return null;
};

export const getUserByDocId = async (param: string) => {
  return (await getDoc(doc(fireStoreDatabase, "users", param))).data();
};

export const getDocIdByField = async (
  field: string,
  param: number | string
) => {
  const queryStmt = query(
      collection(fireStoreDatabase, "users"),
      where(`${field}`, "==", typeof param === "string" ? `${param}` : param)
    ),
    querySnapshot = await getDocs(queryStmt);

  if (querySnapshot.docs.map((doc) => doc.data()).length !== 0)
    return querySnapshot.docs.map((doc) => doc.id)[0];
};

export const forgotPassword = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

export const resetPassword = async (id: string, password: string) => {
  const collectionRef = collection(fireStoreDatabase, "users");
  const updateUserPassword = {
    password: password,
  };

  const userRef = doc(collectionRef, id);
  await updateDoc(userRef, updateUserPassword);
};

export const updateUser = async (data: any) => {
  const collectionRef = collection(fireStoreDatabase, "users");
  const updateUser = { ...data };

  const userRef = doc(collectionRef, data.docId);
  await updateDoc(userRef, updateUser);
};

export const getUser = async () => {
  const queryStmt = query(collection(fireStoreDatabase, "users"));
  const querySnapshot = await getDocs(queryStmt);

  const contracts = querySnapshot.docs.map((doc) => {
    return {
      docId: doc.id,
      firstName: doc.data().firstName,
      lastName: doc.data().lastName,
      dateOfBirth: doc.data().dateOfBirth,
      gender: doc.data().gender,
      nationality: doc.data().nationality,
      phoneNumber: doc.data().phoneNumber,
      idNumber: doc.data().idNumber,
      dateRange: doc.data().dateRange,
      issuedBy: doc.data().issuedBy,
      taxCode: doc.data().taxCode,
      residence: doc.data().residence,
      bank: doc.data().bank,
      bankNumber: doc.data().bankNumber,
      email: doc.data().email,
      userName: doc.data().userName,
      password: doc.data().password,
      companyName: doc.data().companyName,
      position: doc.data().position,
    };
  });

  return contracts;
};

export const checkUserIsExisted = async (email: string) => {
  const queryStmt = query(
      collection(fireStoreDatabase, "users"),
      where("email", "==", `${email}`)
    ),
    querySnapshot = await getDocs(queryStmt);

  if (querySnapshot.docs.map((doc) => doc.data()).length !== 0)
    return querySnapshot.docs.map((doc) => doc.id)[0];
  return null;
};

export const addUser = async (user: any) => {
  const collectionRef = collection(fireStoreDatabase, "users");
  const data = { ...user };

  return (await addDoc(collectionRef, data)).id;
};
