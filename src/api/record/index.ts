import { collection, getDocs, query, where } from "firebase/firestore";

import { fireStoreDatabase } from "~/firebase-config";
import { ICategory, IRecord } from "~/types";

export const getRecords = async (contractId: string) => {
    const queryStmt = query(
        collection(fireStoreDatabase, 'records'),
        where('contractId', '==', `${contractId}`)
    ),
        querySnapshot = await getDocs(queryStmt);

    const records: IRecord[] = querySnapshot.docs.map(doc => {
        return {
            docId: doc.id,
            imageURL: doc.data().imageURL,
            ISRCCode: doc.data().ISRCCode,
            approvalDate: doc.data().approvalDate,
            approvalBy: doc.data().approvalBy,
            audioLink: doc.data().audioLink,
            author: doc.data().author,
            categoriesId: doc.data().categoriesId,
            contractId: doc.data().contractId,
            createdBy: doc.data().createdBy,
            createdDate: doc.data().createdDate,
            format: doc.data().format,
            nameRecord: doc.data().nameRecord,
            producer: doc.data().producer,
            singer: doc.data().singer,
            time: doc.data().time,
            expirationDate: doc.data().expirationDate,
            status: doc.data().status,
        };
    });

    return records;
};

export const getCategories = async () => {
    const queryStmt = query(collection(
        fireStoreDatabase,
        'categories')
    ),
        querySnapshot = await getDocs(queryStmt);

    const categories: ICategory[] = querySnapshot.docs.map(doc => {
        return {
            docId: doc.id,
            name: doc.data().name
        };
    });

    return categories;
};