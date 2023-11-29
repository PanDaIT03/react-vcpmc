import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { fireStoreDatabase } from "~/firebase-config";
import { IContract } from "~/types";

export const getContracts = async () => {
    const queryStmt = query(collection(fireStoreDatabase, 'contract'), orderBy("status", "asc"));
    const querySnapshot = await getDocs(queryStmt);

    const contracts: IContract[] = querySnapshot.docs.map(doc => {
        return {
            docId: doc.id,
            authorized: doc.data().authorized,
            authorizingLegalEntity: doc.data().authorizingLegalEntity,
            censored: doc.data().censored,
            contractCode: doc.data().contractCode,
            contractTypesId: doc.data().contractTypesId,
            createdBy: doc.data().createdBy,
            customer: doc.data().customer,
            dateCreated: doc.data().dateCreated,
            effectiveDate: doc.data().effectiveDate,
            expirationDate: doc.data().expirationDate,
            ownerShips: doc.data().ownerShips,
            status: doc.data().status
        };
    });

    return contracts;
};

export const getUser = async () => {
    const queryStmt = query(collection(
        fireStoreDatabase,
        'users'
    ));
    const querySnapshot = await getDocs(queryStmt);

    const contracts = querySnapshot.docs.map(doc => {
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
        };
    });

    return contracts;
};