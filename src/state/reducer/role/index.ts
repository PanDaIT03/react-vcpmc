import { createSlice } from "@reduxjs/toolkit";

import { getRoleAction, getRoleList } from "~/state/thunk/role/role";
import { IRole, Role } from "~/types";

interface InitType {
  roles: IRole[];
  loading: boolean;
  roleDetails: Role[];
}

const initialState: InitType = {
  roles: [],
  loading: false,
  roleDetails: []
};

const roleSlice = createSlice({
  name: "role",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getRoleAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRoleAction.fulfilled, (state, action) => {
        state.roles = action.payload;
        state.loading = false;
      })
      .addCase(getRoleAction.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getRoleList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRoleList.fulfilled, (state, action) => {
        state.roleDetails = action.payload;
        state.loading = false;
      })
      .addCase(getRoleList.rejected, (state) => {
        state.loading = false;
      })
      .addDefaultCase((state) => {
        return state;
      });
  },
});

export const {} = roleSlice.actions;
export const roleReducer = roleSlice.reducer;
