import { collection, getDocs, query, where } from "firebase/firestore";
import { fireStoreDatabase } from "~/config/firebase";

export const getCategoryId = async (category: string) => {
    const queryStmt = query(
        collection(fireStoreDatabase, "categories"),
        where("name", "==", `${category}`)
    ),
        querySnapshot = await getDocs(queryStmt);

    if (querySnapshot.docs.map((doc) => doc.data()).length !== 0)
        return querySnapshot.docs.map((doc) => doc.id)[0];
    return null;
};