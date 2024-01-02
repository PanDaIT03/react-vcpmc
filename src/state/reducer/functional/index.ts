import { createSlice } from "@reduxjs/toolkit";
import { getFunctionalTypes, getFunctionals } from "~/state/thunk/functional";
import { Functional } from "~/types/Functional";

export type FunctionalType = {
    docId: string;
    name: string;
    code: string;
}

type InitialStateType = {
    functionals: Array<Functional>;
    loading: boolean;
    typeList: Array<FunctionalType>;
}

const initialState: InitialStateType = {
    functionals: [],
    loading: false,
    typeList: []
}

const functionalSlice = createSlice({
    name: 'functional',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getFunctionals.pending, state => {
            state.loading = true;
        });
        builder.addCase(getFunctionals.fulfilled, (state, action) => {
            state.loading = false;

            if (action.payload)
                state.functionals = action.payload;
        });
        builder.addCase(getFunctionals.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(getFunctionalTypes.pending, state => {
            state.loading = true;
        });
        builder.addCase(getFunctionalTypes.fulfilled, (state, action) => {
            state.loading = false;

            if (action.payload)
                state.typeList = action.payload;
        });
        builder.addCase(getFunctionalTypes.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
    }
});

export const { reducer: functionalReducer } = functionalSlice;