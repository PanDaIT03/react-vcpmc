import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";

import { fireStoreDatabase } from "~/firebase-config";
import { IContract, IContractDetail } from "~/types";

export const getContracts = async () => {
    const queryStmt = query(collection(
        fireStoreDatabase,
        'contract'
    ));
    const querySnapshot = await getDocs(queryStmt);
    const contracts: IContract[] = [];

    querySnapshot.docs.map(doc => {
        contracts.push({
            docId: doc.id,
            censored: doc.data().censored,
            contractCode: doc.data().contractCode,
            contractDetailsId: doc.data().contractDetailsId,
            contractTypesId: doc.data().contractTypesId,
            createdBy: doc.data().createdBy,
            customer: doc.data().customer,
            dateCreated: doc.data().dateCreated,
            effectiveDate: doc.data().effectiveDate,
            expirationDate: doc.data().expirationDate,
            ownerShip: doc.data().ownerShip,
            status: doc.data().status
        });
    });

    return contracts;
};

export const getContractDetails = async () => {
    const queryStmt = query(collection(
        fireStoreDatabase,
        'contractDetails'
    ));
    const querySnapshot = await getDocs(queryStmt);
    const contractDetails: IContractDetail[] = [];

    querySnapshot.docs.map(doc => {
        contractDetails.push({
            docId: doc.id,
            authorizedName: doc.data().authorizedName,
            authorizingLegalEntity: doc.data().authorizingLegalEntity,
            citizenId: doc.data().citizenId,
            dateRange: doc.data().dateRange,
            issuedBy: doc.data().issuedBy,
            nationality: doc.data().nationality,
            note: doc.data().note,
            phoneNumber: doc.data().phoneNumber,
            position: doc.data().position,
            representative: doc.data().representative,
            residence: doc.data().residence,
            taxCode: doc.data().residence
        });
    });

    return contractDetails;
};

export const getContractDetailsByIdContract = async (param: string) => {
    const contractDetails =
        (await getDoc(doc(fireStoreDatabase, 'contractDetails', param))).data();
    return contractDetails;
};