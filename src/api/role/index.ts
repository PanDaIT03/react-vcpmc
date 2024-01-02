import { addDoc, collection, deleteDoc, doc, getDocs, query, setDoc } from "firebase/firestore";

import { fireStoreDatabase } from "~/config/firebase";
import { IRole, Role } from "~/types/RoleType";

export const getRoles = async () => {
  const queryStmt = query(collection(fireStoreDatabase, "roles"));
  const querySnapshot = await getDocs(queryStmt);
  const roles: IRole[] = [];

  querySnapshot.docs.map((doc) =>
    roles.push({ docId: doc.id, role: doc.data().role })
  );

  return roles;
};

export const getListRole = async () => {
  const q = query(collection(fireStoreDatabase, 'roles'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({
    docId: doc.id,
    role: doc.data().role,
    name: doc.data().name,
    description: doc.data().description,
    functionalsId: doc.data().functionalsId,
    allowDelete: doc.data().allowDelete
  }));
}

export const deleteRoleAPI = async (id: string) => {
  await deleteDoc(doc(fireStoreDatabase, 'roles', `${id}`));
}

export const updateRoleById = async (role: Omit<Role, 'docId'> & { docId?: string }) => {
  const { docId } = role;
  delete role.docId;

  await setDoc(doc(fireStoreDatabase, 'roles', `${docId}`), role);
}

export const addRoleAPI = async (role: Omit<Role, 'docId'>) => {
  await addDoc(collection(fireStoreDatabase, 'roles'), role);
}
