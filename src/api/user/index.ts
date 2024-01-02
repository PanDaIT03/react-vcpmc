import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { sendPasswordResetEmail } from "firebase/auth";
import { auth, fireStoreDatabase } from "../../config/firebase";
import { IUser, Role, User } from "../../types";
import { getListRole, getRoles } from "../role";

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

export const getUserById = async (id: string, roleList?: Role[]) => {
  let result = (await getDoc(doc(fireStoreDatabase, 'users', id))).data();

  if (typeof roleList === 'undefined' || roleList.length < 0)
    roleList = await getListRole();

  if (!result) return {} as User;

  return {
    avatar: result.avatar,
    bank: result.bank,
    bankNumber: result.bankNumber,
    dateOfBirth: result.dateOfBirth,
    dateRange: result.dateRange,
    email: result.email,
    firstName: result.firstName,
    gender: result.gender,
    idNumber: result.idNumber,
    issuedBy: result.issuedBy,
    lastName: result.lastName,
    nationality: result.nationality,
    password: result.password,
    phoneNumber: result.phoneNumber,
    residence: result.residence,
    rolesId: result.rolesId,
    taxCode: result.taxCode,
    userName: result.userName,
    docId: result.id,
    role: roleList?.find(role => result && role.docId === result.rolesId) || { docId: '', name: '' },
    companyName: result.companyName,
    status: result.status,
    expirationDate: result.expirationDate
  }
}

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

export const saveUserAPI = async (user: Omit<IUser, 'role'>) => {
  await setDoc(doc(fireStoreDatabase, `users`, `${user.docId}`), user);
}

export const getUserList = async () => {
  const resultSnapshot = getDocs(collection(fireStoreDatabase, 'users'));
  const roles = await getListRole();

  return (await resultSnapshot).docs.map(doc => {
    const role = roles.find(role => role.docId === doc.data().rolesId) || { docId: '', name: '' };

    return {
      avatar: doc.data().avatar,
      bank: doc.data().bank,
      bankNumber: doc.data().bankNumber,
      dateOfBirth: doc.data().dateOfBirth,
      dateRange: doc.data().dateRange,
      email: doc.data().email,
      firstName: doc.data().firstName,
      gender: doc.data().gender,
      idNumber: doc.data().idNumber,
      issuedBy: doc.data().issuedBy,
      lastName: doc.data().lastName,
      nationality: doc.data().nationality,
      password: doc.data().password,
      phoneNumber: doc.data().phoneNumber,
      residence: doc.data().residence,
      rolesId: doc.data().rolesId,
      taxCode: doc.data().taxCode,
      userName: doc.data().userName,
      docId: doc.id,
      role: { docId: role.docId, name: role.name },
      companyName: doc.data().companyName,
      status: doc.data().status,
      expirationDate: doc.data().expirationDate
    }
  });
}

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

export const deleteUserById = async (id: string) => {
  await deleteDoc(doc(fireStoreDatabase, 'users', `${id}`));
}
