import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc, writeBatch } from "firebase/firestore";

import { getRecords } from "~/api/record";
import { fireStoreDatabase } from "~/config/firebase";
import { ETMContractType, EtmContract, EtmContractDetail, EtmContractForControl, OwnRecord } from "~/types/EntrustmentContractType";
import { User } from "~/types/UserType";
import { getRecordPlayList } from "../recordPlay";

export const getEtmContracts = async () => {
    const resultSnapshot = await getDocs(collection(fireStoreDatabase, 'entrustmentContract'));

    return resultSnapshot.docs.map(doc => ({
        docId: doc.id,
        code: doc.data().code,
        createdBy: doc.data().createdBy,
        createdDate: doc.data().createdDate,
        distributionValue: doc.data().distributionValue,
        effectiveDate: doc.data().effectiveDate,
        expirationDate: doc.data().expirationDate,
        name: doc.data().name,
        status: doc.data().status,
        type: doc.data().type,
        value: doc.data().value,
        companyName: doc.data().companyName,
        position: doc.data().position,
        usersId: doc.data().usersId,
        playValue: doc.data().playValue,
        employeeIds: doc.data().employeeIds
    }));
}

export const getEtmContractsDetail = async () => {
    const resultSnapshot = await getDocs(collection(fireStoreDatabase, 'entrustmentContract'));
    const userList = await getDocs(collection(fireStoreDatabase, 'users'));
    const roleList = await getDocs(collection(fireStoreDatabase, 'roles'));

    return resultSnapshot.docs.map(doc => {
        let createdBy = userList.docs.find(user => user.id === doc.data().createdBy);
        let authorizedUser = userList.docs.find(user => user.id === doc.data().usersId);
        const roleCreatedBy = roleList.docs.find(role => role.id === createdBy?.id);
        const roleAuthorizedUser = roleList.docs.find(role => role.id === authorizedUser?.id);

        return {
            docId: doc.id,
            code: doc.data().code,
            createdBy: {
                avatar: createdBy?.data().avatar || '',
                bank: createdBy?.data().bank || '',
                bankNumber: createdBy?.data().bankNumber || '',
                dateOfBirth: createdBy?.data().dateOfBirth || '',
                dateRange: createdBy?.data().dateRange || '',
                email: createdBy?.data().email || '',
                firstName: createdBy?.data().firstName || '',
                gender: createdBy?.data().gender || '',
                idNumber: createdBy?.data().idNumber || '',
                issuedBy: createdBy?.data().issuedBy || '',
                lastName: createdBy?.data().lastName || '',
                nationality: createdBy?.data().nationality || '',
                password: createdBy?.data().password || '',
                phoneNumber: createdBy?.data().phoneNumber || '',
                residence: createdBy?.data().residence || '',
                rolesId: createdBy?.data().rolesId || '',
                taxCode: createdBy?.data().taxCode || '',
                userName: createdBy?.data().userName || '',
                role: roleCreatedBy ? { docId: roleCreatedBy.id, name: roleCreatedBy.data().role } : { docId: '', name: '' },
                docId: createdBy?.id || '',
                checkpointDate: doc.data().checkpointDate,
                statusForControl: doc.data().statusForControl
            },
            createdDate: doc.data().createdDate,
            distributionValue: doc.data().distributionValue,
            effectiveDate: doc.data().effectiveDate,
            expirationDate: doc.data().expirationDate,
            name: doc.data().name,
            status: doc.data().status,
            type: doc.data().type,
            value: doc.data().value,
            companyName: doc.data().companyName,
            position: doc.data().position,
            user: {
                avatar: authorizedUser?.data().avatar || '',
                bank: authorizedUser?.data().bank || '',
                bankNumber: authorizedUser?.data().bankNumber || '',
                dateOfBirth: authorizedUser?.data().dateOfBirth || '',
                dateRange: authorizedUser?.data().dateRange || '',
                email: authorizedUser?.data().email || '',
                firstName: authorizedUser?.data().firstName || '',
                gender: authorizedUser?.data().gender || '',
                idNumber: authorizedUser?.data().idNumber || '',
                issuedBy: authorizedUser?.data().issuedBy || '',
                lastName: authorizedUser?.data().lastName || '',
                nationality: authorizedUser?.data().nationality || '',
                password: authorizedUser?.data().password || '',
                phoneNumber: authorizedUser?.data().phoneNumber || '',
                residence: authorizedUser?.data().residence || '',
                rolesId: authorizedUser?.data().rolesId || '',
                taxCode: authorizedUser?.data().taxCode || '',
                userName: authorizedUser?.data().userName || '',
                role: roleAuthorizedUser ? { docId: roleAuthorizedUser.id, name: roleAuthorizedUser.data().role } : { docId: '', name: '' },
                docId: authorizedUser?.id || '',
                status: authorizedUser?.data().status
            },
            playValue: doc.data().playValue,
            employeeIds: doc.data().employeeIds
        }
    });
}

export const getEtmContractForControlList = async () => {
    const resultSnapshot = await getDocs(collection(fireStoreDatabase, 'entrustmentContract'));
    const recordPlays = await getRecordPlayList();
    const records = await getRecords();

    return resultSnapshot.docs.map(doc => {
        let recordList: Array<OwnRecord> = records.map(record => {
            if (record.etmContractsId === doc.id)
                return {
                    ...record,
                    totalPlay: recordPlays.filter(recordPlay => recordPlay.recordsId === record.docId).reduce((sum, item) => sum + parseInt(item.playsCount), 0)
                }
            return {
                ...record,
                totalPlay: 0
            };
        });
        let recordsOfContract = recordList.filter(record => record.etmContractsId === doc.id);
        let recordPlay = recordPlays.
            filter(recordPlay => recordsOfContract.
                some(record => record.docId === recordPlay.recordsId)
            );
        let totalPlay = recordPlay.reduce((sum, item) => sum + parseInt(item.playsCount), 0);

        return {
            docId: doc.id,
            code: doc.data().code,
            createdBy: doc.data().createdBy,
            createdDate: doc.data().createdDate,
            distributionValue: doc.data().distributionValue,
            effectiveDate: doc.data().effectiveDate,
            expirationDate: doc.data().expirationDate,
            name: doc.data().name,
            status: doc.data().status,
            type: doc.data().type,
            value: doc.data().value,
            companyName: doc.data().companyName,
            position: doc.data().position,
            usersId: doc.data().usersId,
            playValue: doc.data().playValue,
            productionRight: doc.data().productionRight,
            performanceRight: doc.data().performanceRight,
            vcpmcRight: doc.data().vcpmcRight,
            records: recordsOfContract,
            totalPlay: totalPlay,
            CPM: doc.data().CPM,
            checkpointDate: doc.data().checkpointDate,
            unDistributedRevenue: doc.data().unDistributedRevenue,
            statusForControl: doc.data().statusForControl,
            employeeIds: doc.data().employeeIds,
            administrativeFee: doc.data().royalties,
            recordPlay: recordPlay
        }
    });
}

export const getEtmContractById = async (id: string) => {
    const result = (await getDoc(doc(fireStoreDatabase, 'entrustmentContract', id))).data();

    if (!result) return {} as EtmContract;

    return {
        docId: id,
        code: result.code,
        createdBy: result.createdBy,
        createdDate: result.createdDate,
        distributionValue: result.distributionValue,
        effectiveDate: result.effectiveDate,
        expirationDate: result.expirationDate,
        name: result.name,
        status: result.status,
        type: result.type,
        value: result.value,
        companyName: result.companyName,
        position: result.position,
        usersId: result.usersId,
        playValue: result.playValue,
        employeeIds: result.employeeIds
    }
}

export const saveETMContract = async ({ contract }: {
    contract: EtmContract & {
        checkpointDate: string;
        CPM: number;
        performanceRight: number;
        productionRight: number;
        royalties: number;
        unDistributedRevenue: number;
        vcpmcRight: number;
    }
}) => {
    if (contract.docId !== '') {
        const { docId } = contract;

        return await setDoc(doc(fireStoreDatabase, 'entrustmentContract', `${docId}`), contract);
    }

    return await addDoc(collection(fireStoreDatabase, 'entrustmentContract'), { ...contract });
}

export const getETMContractTypes = async () => {
    const resultSnapshot = await getDocs(collection(fireStoreDatabase, 'entrustmentContractTypes'));

    return resultSnapshot.docs.map(doc => ({
        docId: doc.id,
        name: doc.data().name,
        revenuePercent: doc.data().revenuePercent,
        applyDate: doc.data().applyDate
    }));
}

export const updateContractTypesById = async (types: Array<ETMContractType>) => {
    const batch = writeBatch(fireStoreDatabase);

    types.forEach(type => {
        batch.set(doc(fireStoreDatabase, "entrustmentContractTypes", type.docId), type);
    });

    await batch.commit();
}

export const addContractTypesAPI = async (type: ETMContractType) => {
    await addDoc(collection(fireStoreDatabase, 'entrustmentContractTypes'), type);
}

export const deleteContractTypesAPI = async (id: string) => {
    await deleteDoc(doc(fireStoreDatabase, 'entrustmentContractTypes', `${id}`));
}

export const addEmployeeToContract = async ({ user, employeeIds, entrustmentContractId }: { user: Omit<User, 'role' | 'docId'>; employeeIds: Array<string>; entrustmentContractId: string; }) => {
    const userId = (await addDoc(collection(fireStoreDatabase, 'users'), user)).id;

    await updateDoc(doc(fireStoreDatabase, 'entrustmentContract', `${entrustmentContractId}`), { employeeIds: [...employeeIds, userId] });
}

export const deleteEmployeesById = async ({ currentEmployees, id, employeeIds }: { employeeIds: Array<string>, currentEmployees: Array<string>, id: string }) => {
    await updateDoc(doc(fireStoreDatabase, 'entrustmentContract', `${id}`), { employeeIds: currentEmployees });

    const batch = writeBatch(fireStoreDatabase);
    employeeIds.forEach(employee => {
        batch.delete(doc(fireStoreDatabase, "users", employee));
    });
    await batch.commit();
}

export const deleteContractById = async (contracts: Array<EtmContractDetail>) => {
    const batch = writeBatch(fireStoreDatabase);
    contracts.forEach(contract => {
        batch.delete(doc(fireStoreDatabase, 'entrustmentContract', contract.docId));
        batch.delete(doc(fireStoreDatabase, 'users', contract.user.docId));
    });
    await batch.commit();
}

export const checkpointContracts = async ({ contracts, checkpointDate }: { contracts: Array<EtmContractForControl>; checkpointDate: string }) => {
    const batch = writeBatch(fireStoreDatabase);
    contracts.forEach(contract => {
        batch.update(doc(fireStoreDatabase, 'entrustmentContract', contract.docId), { checkpointDate: checkpointDate });
    });
    await batch.commit();
}