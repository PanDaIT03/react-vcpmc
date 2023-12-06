import { createSlice } from "@reduxjs/toolkit";

import { getRoleAction } from "~/state/thunk/role/role";
import { IRole } from "~/types";

interface InitType {
    roles: IRole[]
};

const initialState: InitType = {
    roles: []
};

const roleSlice = createSlice({
    name: "role",
    initialState: initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(getRoleAction.fulfilled, (state, action) => {
                state.roles = action.payload;
            })
            .addDefaultCase(state => {
                return state;
            })
    }
});

export const { } = roleSlice.actions;
export const roleReducer = roleSlice.reducer;