import { createAsyncThunk } from "@reduxjs/toolkit";
import { getFunctionalList, getFunctionalTypeList } from "~/api/functional";

export const getFunctionals = createAsyncThunk(
    'functional/getFunctionals',
    async () => {
        return await getFunctionalList();
    }
);

export const getFunctionalTypes = createAsyncThunk(
    'functional/getFunctionalTypes',
    async () => {
        return await getFunctionalTypeList();
    }
);