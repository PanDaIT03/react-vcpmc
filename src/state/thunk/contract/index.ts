import { createAsyncThunk } from "@reduxjs/toolkit";

import { getContracts, getUser } from "~/api/contract";

export const getContractAction = createAsyncThunk(
    'contract/getContract',
    async (_, thunkAPI) => {
        const contracts = await getContracts();
        const users = await getUser();

        if (contracts && users) {
            return {
                contracts,
                users
            };
        };
        return null;
    }
);