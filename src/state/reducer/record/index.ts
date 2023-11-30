import { createSlice } from "@reduxjs/toolkit";

import { getRecordsAction } from "~/state/thunk/record";
import { IRecord } from "~/types";

interface InitType {
    records: (IRecord)[]
    loading: boolean
    status: string
};

const initialState: InitType = {
    records: [],
    loading: false,
    status: "get successfully" || "get failed"
};

const recordSlice = createSlice({
    name: "record",
    initialState: initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(getRecordsAction.pending, state => {
                state.loading = true;
            })
            .addCase(getRecordsAction.fulfilled, (state, action) => {
                if (action.payload !== null) {
                    const { records, categories } = action.payload;
                    const authorizedSongs: IRecord[] = [];

                    records.forEach(record => {
                        categories.forEach(category => {
                            if (record.categoriesId === category.docId)
                                authorizedSongs.push({ ...record, category: category.name });
                        });
                    });
                    state.records = authorizedSongs;
                    state.loading = false;
                    state.status = "get successfully";
                };
            })
            .addCase(getRecordsAction.rejected, state => {
                state.loading = false;
                state.status = "get failed";
            })
            .addDefaultCase(state => {
                return state;
            })
    }
});

export const { } = recordSlice.actions;
export const recordReducer = recordSlice.reducer;