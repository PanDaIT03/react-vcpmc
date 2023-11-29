import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";

import { IUser } from "../../types";
import { auth, fireStoreDatabase } from "../../firebase-config";

export const checkLogin =
    async ({ userName, password }: Pick<IUser, "userName" | "password">) => {
        const queryStmt = query(
            collection(fireStoreDatabase, 'users'),
            where('userName', '==', `${userName}`),
            where('password', '==', `${password}`)
        ),
            querySnapshot = await getDocs(queryStmt);

        if (querySnapshot.docs.map(doc => doc.data()).length !== 0)
            return querySnapshot.docs.map(doc => doc.id)[0];
        return null;
    };

export const getUserByDocId = async (param: string) => {
    return (await getDoc(doc(fireStoreDatabase, 'users', param))).data();
};

export const getDocIdByField = async (field: string, param: number | string) => {
    const queryStmt = query(
        collection(fireStoreDatabase, 'users'),
        where(`${field}`, '==', typeof param === "string" ? `${param}` : param)
    ),
        querySnapshot = await getDocs(queryStmt);

    if (querySnapshot.docs.map(doc => doc.data()).length !== 0)
        return querySnapshot.docs.map(doc => doc.id)[0];
};

export const forgotPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
};

export const resetPassword = async (id: string, password: string) => {
    const collectionRef = collection(fireStoreDatabase, 'users');
    const updateUserPassword = {
        password: password
    };

    const userRef = doc(collectionRef, id);
    await updateDoc(userRef, updateUserPassword);
};

export const updateUser = async (data: Omit<IUser, "email" | "userName" |
    "password" | "rolesId" | "role">) => {
    const collectionRef = collection(fireStoreDatabase, 'users');
    const updateUser = {
        avatar: data.avatar,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        phoneNumber: data.phoneNumber,
    };

    const userRef = doc(collectionRef, data.id);
    await updateDoc(userRef, updateUser);
};