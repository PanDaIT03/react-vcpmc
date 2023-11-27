import { createAsyncThunk } from "@reduxjs/toolkit";

import { getContractDetails, getContracts } from "~/api/contract";

export const getContractAction = createAsyncThunk(
    'contract/getContract',
    async (_, thunkAPI) => {
        const contracts = await getContracts();
        const contractDetails = await getContractDetails();
        
        return {
            contracts,
            contractDetails
        };
    }
);