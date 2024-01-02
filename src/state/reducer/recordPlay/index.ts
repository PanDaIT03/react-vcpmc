import { createSlice } from "@reduxjs/toolkit";
import { getRecordPlays } from "~/state/thunk/recordPlay";
import { IRecordPlay } from "~/types/RecordPlay";

type InitialStateType = {
    recordPlays: Array<IRecordPlay>;
    loading: boolean;
}

const initialState: InitialStateType = {
    recordPlays: [],
    loading: false
}

const recordPlaySlice = createSlice({
    name: 'recordPlay',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getRecordPlays.pending, state => {
            state.loading = true;
        });
        builder.addCase(getRecordPlays.fulfilled, (state, action) => {
            state.loading = false;

            if (action.payload)
                state.recordPlays = action.payload;
        });
        builder.addCase(getRecordPlays.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
    }
});

export const { reducer: recordPlayReducer } = recordPlaySlice;