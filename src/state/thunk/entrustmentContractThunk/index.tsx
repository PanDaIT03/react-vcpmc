import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    ETMContractType,
    EtmContract,
    EtmContractDetail,
    EtmContractForControl,
    addContractTypesAPI,
    addEmployeeToContract,
    checkpointContracts,
    deleteContractById,
    deleteContractTypesAPI,
    deleteEmployeesById,
    getETMContractTypes,
    getEtmContractById,
    getEtmContractForControlList,
    getEtmContracts,
    getEtmContractsDetail,
    saveETMContract,
    updateContractTypesById
} from "~/api/entrustmentContract";
import { addUser } from "~/api/user";
import { IUser, User } from "~/types";
import { getUsers, saveUser } from "../user/user";
import { doc, updateDoc } from "firebase/firestore";
import { fireStoreDatabase } from "~/config/firebase";

export const getEtmContractList = createAsyncThunk(
    'etmContract/getEtmContractList',
    async () => {
        return await getEtmContracts();
    }
);

export const getETMContractById = createAsyncThunk(
    'etmContract/getETMContractById',
    async (id: string) => {
        return await getEtmContractById(id);
    }
);

type SaveEntrustmentContractParamsType = {
    contract: EtmContract;
    user: Omit<IUser, 'role'>;
    navigate: () => void;
}

export const saveEntrustmentContract = createAsyncThunk(
    'etmContract/saveEntrustmentContract',
    async ({ contract, user, navigate }: SaveEntrustmentContractParamsType, thunkAPI) => {
        let newUser;

        if (user.docId === '') {
            newUser = await addUser(user);
            await saveETMContract({
                contract: {
                    ...contract,
                    usersId: newUser,
                    checkpointDate: '',
                    CPM: 2280000,
                    performanceRight: 40,
                    productionRight: 40,
                    royalties: 0.5,
                    unDistributedRevenue: 0,
                    vcpmcRight: 20,
                    employeeIds: []
                }
            });
        }
        else {
            thunkAPI.dispatch(saveUser({ user }));
            await saveETMContract({
                contract: {
                    ...contract,
                    checkpointDate: '',
                    CPM: 2280000,
                    performanceRight: 40,
                    productionRight: 40,
                    royalties: 0.5,
                    unDistributedRevenue: 0,
                    vcpmcRight: 20,
                    employeeIds: []
                }
            });
        }

        navigate();
    }
);

export const cancelEntrustmentContract = createAsyncThunk(
    'etmContract/cancelEntrustmentContract',
    async (contract: { docId: string, status: string }) => {
        await updateDoc(doc(fireStoreDatabase, 'entrustmentContract', `${contract.docId}`), { ...contract });
    }
);

export const getEtmContractListDetail = createAsyncThunk(
    'etmContract/getEtmContractListDetail',
    async () => {
        return await getEtmContractsDetail();
    }
);

export const getEtmContractForControls = createAsyncThunk(
    'etmContract/getEtmContractForControls',
    async () => {
        return await getEtmContractForControlList();
    }
);

export const getEtmContractTypes = createAsyncThunk(
    'etmContract/getEtmContractTypes',
    async () => {
        return await getETMContractTypes();
    }
);

export const updateEtmContractTypes = createAsyncThunk(
    'etmContract/updateEtmContractTypes',
    async ({ types, navigate }: { types: Array<ETMContractType>, navigate: () => void }) => {
        await updateContractTypesById(types);
        navigate();
    }
);

export const addEtmContractType = createAsyncThunk(
    'etmContract/addEtmContractTypes',
    async ({ type }: { type: ETMContractType }, thunkAPI) => {
        await addContractTypesAPI(type);
        thunkAPI.dispatch(getEtmContractTypes());
    }
);

export const deleteEtmContractType = createAsyncThunk(
    'etmContract/deleteEtmContractType',
    async ({ id }: { id: string }, thunkAPI) => {
        await deleteContractTypesAPI(id);
        thunkAPI.dispatch(getEtmContractTypes());
    }
);

export const addEmployee = createAsyncThunk(
    'etmContract/addEmployee',
    async ({ user, employeeIds, navigate, entrustmentContractId }: {
        user: Omit<User, 'role' | 'docId'>;
        navigate: () => void;
        employeeIds: Array<string>;
        entrustmentContractId: string;
    }, thunkAPI) => {
        await addEmployeeToContract({ user, employeeIds, entrustmentContractId });

        await thunkAPI.dispatch(getEtmContractListDetail());
        await thunkAPI.dispatch(getUsers());

        navigate();
    }
);

export const updateEmployee = createAsyncThunk(
    'etmContract/updateEmployee',
    async ({ user, navigate }: {
        user: Omit<User, 'role'>;
        navigate?: () => void;
    }, thunkAPI) => {
        console.log(user);
        await thunkAPI.dispatch(saveUser({ user }));

        await thunkAPI.dispatch(getUsers());
        navigate && navigate();
    }
);

export const deleteEmployees = createAsyncThunk(
    'etmContract/deleteEmployees',
    async ({ currentEmployees, employeeIds, id }: { currentEmployees: Array<string>, id: string, employeeIds: Array<string> }, thunkAPI) => {
        if (id === '') return;

        await deleteEmployeesById({ currentEmployees, id, employeeIds });

        await thunkAPI.dispatch(getEtmContractListDetail());
        await thunkAPI.dispatch(getUsers());
    }
);

export const deleteContracts = createAsyncThunk(
    'etmContract/deleteContracts',
    async (contracts: Array<EtmContractDetail>, thunkAPI) => {
        await deleteContractById(contracts);

        await thunkAPI.dispatch(getEtmContractListDetail());
        await thunkAPI.dispatch(getUsers());
    }
);

export const checkpointAllContract = createAsyncThunk(
    'etmContract/checkpointAllContract',
    async ({ contracts, checkpointDate }: { contracts: Array<EtmContractForControl>; checkpointDate: string }, thunkAPI) => {
        await checkpointContracts({ contracts, checkpointDate });

        thunkAPI.dispatch(getEtmContractForControls());
    }
);