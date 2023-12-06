import { createAsyncThunk } from "@reduxjs/toolkit";
import { getRoles } from "~/api/role";

export const getRoleAction = createAsyncThunk(
    'role/getRole',
    async (_, thunkAPI) => {
        return await getRoles();
    }
);