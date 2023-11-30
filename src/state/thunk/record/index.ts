import { createAsyncThunk } from "@reduxjs/toolkit";

import { getCategories, getRecords } from "~/api/record";

export const getRecordsAction = createAsyncThunk(
    'record/getRecords',
    async (contractId: string, thunkAPI) => {
        const records = await getRecords(contractId);
        const categories = await getCategories();

        if (records && categories)
            return {
                records,
                categories
            };
        return null;
    }
);