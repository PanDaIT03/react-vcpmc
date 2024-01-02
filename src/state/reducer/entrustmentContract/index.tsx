import { createSlice } from "@reduxjs/toolkit";

import { ETMContractType, EtmContract, EtmContractDetail, EtmContractForControl } from "~/api/entrustmentContract";
import { QUARTERLY } from "~/constants";
import {
    addEmployee,
    addEtmContractType,
    cancelEntrustmentContract,
    checkpointAllContract,
    deleteContracts,
    deleteEmployees,
    deleteEtmContractType,
    getETMContractById,
    getEtmContractForControls,
    getEtmContractList,
    getEtmContractListDetail,
    getEtmContractTypes,
    saveEntrustmentContract,
    updateEmployee,
    updateEtmContractTypes
} from "~/state/thunk/entrustmentContractThunk";

export type Quarterly = {
    quarter: string;
    time: string;
}

export type Monthly = {
    start: string;
    end: string;
}

type InitialState = {
    etmContractList: Array<EtmContract>;
    loading: boolean;
    etmContract: EtmContract;
    etmContractsDetail: Array<EtmContractDetail>;
    etmContractForControl: Array<EtmContractForControl>;
    expiredWarningDate: number;
    types: Array<ETMContractType>;
    forControlCircle:
    { type: string, controlCircle: Array<Quarterly> } |
    { type: string, controlCircle: Monthly };
    status: string;
}

const initialState: InitialState = {
    etmContractList: [],
    loading: false,
    etmContract: {} as EtmContract,
    etmContractsDetail: [] as EtmContractDetail[],
    etmContractForControl: [] as EtmContractForControl[],
    expiredWarningDate: 365,
    types: [] as Array<ETMContractType>,
    forControlCircle: {
        type: 'quarterly',
        controlCircle: QUARTERLY
    },
    status: ''
}

const etmContractSlice = createSlice({
    name: 'etmContract',
    initialState,
    reducers: {
        setExpiredWarningDate: (state, action) => {
            state.expiredWarningDate = action.payload.expirationDate;
            action.payload.navigate();
        },
        setForControlCircle: (state, action) => {
            state.forControlCircle = action.payload;
        },
        setStatus: (state, action) => {
            state.status = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(getEtmContractList.pending, state => {
            state.loading = true;
        });
        builder.addCase(getEtmContractList.fulfilled, (state, action) => {
            state.loading = false;

            if (action.payload)
                state.etmContractList = action.payload;
        });
        builder.addCase(getEtmContractList.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(getETMContractById.pending, state => {
            state.loading = true;
        });
        builder.addCase(getETMContractById.fulfilled, (state, action) => {
            state.loading = false;

            if (action.payload)
                state.etmContract = action.payload;
        });
        builder.addCase(getETMContractById.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(saveEntrustmentContract.pending, state => {
            state.loading = true;
        });
        builder.addCase(saveEntrustmentContract.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(saveEntrustmentContract.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(cancelEntrustmentContract.pending, state => {
            state.loading = true;
        });
        builder.addCase(cancelEntrustmentContract.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(cancelEntrustmentContract.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(getEtmContractListDetail.pending, state => {
            state.loading = true;
        });
        builder.addCase(getEtmContractListDetail.fulfilled, (state, action) => {
            state.loading = false;
            state.etmContractsDetail = action.payload;
        });
        builder.addCase(getEtmContractListDetail.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(getEtmContractTypes.pending, state => {
            state.loading = true;
        });
        builder.addCase(getEtmContractTypes.fulfilled, (state, action) => {
            state.loading = false;
            state.types = action.payload;
        });
        builder.addCase(getEtmContractTypes.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(updateEtmContractTypes.pending, state => {
            state.loading = true;
        });
        builder.addCase(updateEtmContractTypes.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(updateEtmContractTypes.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(addEtmContractType.pending, state => {
            state.loading = true;
        });
        builder.addCase(addEtmContractType.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(addEtmContractType.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(deleteEtmContractType.pending, state => {
            state.loading = true;
        });
        builder.addCase(deleteEtmContractType.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(deleteEtmContractType.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(getEtmContractForControls.pending, state => {
            state.loading = true;
        });
        builder.addCase(getEtmContractForControls.fulfilled, (state, action) => {
            state.loading = false;

            if (action.payload) state.etmContractForControl = action.payload;
        });
        builder.addCase(getEtmContractForControls.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(addEmployee.pending, state => {
            state.loading = true;
            state.status = 'adding...';
        });
        builder.addCase(addEmployee.fulfilled, (state) => {
            state.loading = false;
            state.status = 'add successfully';
        });
        builder.addCase(addEmployee.rejected, (state, action) => {
            state.loading = false;
            state.status = 'add failure';
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(deleteEmployees.pending, state => {
            state.loading = true;
        });
        builder.addCase(deleteEmployees.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(deleteEmployees.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(updateEmployee.pending, state => {
            state.loading = true;
        });
        builder.addCase(updateEmployee.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(updateEmployee.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(deleteContracts.pending, state => {
            state.loading = true;
        });
        builder.addCase(deleteContracts.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(deleteContracts.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(checkpointAllContract.pending, state => {
            state.loading = true;
        });
        builder.addCase(checkpointAllContract.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(checkpointAllContract.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
    }
});

export const { reducer: etmContractReducer } = etmContractSlice;
export const { setExpiredWarningDate, setForControlCircle, setStatus } = etmContractSlice.actions;