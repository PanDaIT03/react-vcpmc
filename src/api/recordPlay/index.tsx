import { collection, getDocs } from "firebase/firestore";
import { fireStoreDatabase } from "~/config/firebase";

export const getRecordPlayList = async () => {
    const resultSnapshot = getDocs(collection(fireStoreDatabase, 'recordPlays'));

    return (await resultSnapshot).docs.map(doc => ({
        id: doc.id,
        recordsId: doc.data().recordsId,
        playsCount: doc.data().playsCount,
        date: doc.data().date
    }));
}