import { collection, getDocs } from "firebase/firestore";
import { fireStoreDatabase } from "~/config/firebase";

export const getFunctionalList = async () => {
    const resultSnapshot = getDocs(collection(fireStoreDatabase, 'functionals'));

    return (await resultSnapshot).docs.map(doc => ({
        docId: doc.id,
        name: doc.data().name,
        code: doc.data().code,
        functionalTypesId: doc.data().functionalTypesId
    }));
}

export const getFunctionalTypeList = async () => {
    const resultSnapshot = getDocs(collection(fireStoreDatabase, 'functionalTypes'));

    return (await resultSnapshot).docs.map(doc => ({
        docId: doc.id,
        name: doc.data().name,
        code: doc.data().code,
    }));
}