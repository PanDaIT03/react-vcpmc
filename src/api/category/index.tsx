import { addDoc, collection, doc, getDocs, query, where, writeBatch } from "firebase/firestore";
import { fireStoreDatabase } from "~/config/firebase";
import { ICategory } from "~/types";

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

export const getCategoryList = async () => {
    const q = query(collection(fireStoreDatabase, 'categories'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
        docId: doc.id,
        name: doc.data().name,
        description: doc.data().description
    }));
}

export const updateCategoriesById = async (categories: ICategory[]) => {
    const batch = writeBatch(fireStoreDatabase);

    categories.forEach(category => {
        batch.set(doc(fireStoreDatabase, "categories", category.docId), category);
    });

    await batch.commit();
}

export const addCategoryAPI = async (category: ICategory) => {
    await addDoc(collection(fireStoreDatabase, 'categories'), category);
}