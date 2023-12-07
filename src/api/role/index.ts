import { collection, getDocs, query } from "firebase/firestore";

import { fireStoreDatabase } from "~/config/firebase";
import { IRole } from "~/types/RoleType";

export const getRoles = async () => {
  const queryStmt = query(collection(fireStoreDatabase, "roles"));
  const querySnapshot = await getDocs(queryStmt);
  const roles: IRole[] = [];

  querySnapshot.docs.map((doc) =>
    roles.push({ docId: doc.id, role: doc.data().role })
  );

  return roles;
};
