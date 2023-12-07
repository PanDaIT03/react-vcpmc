import { createSlice } from "@reduxjs/toolkit";

import { getRoleAction } from "~/state/thunk/role/role";
import { IRole } from "~/types";

interface InitType {
  roles: IRole[];
  loading: boolean;
}

const initialState: InitType = {
  roles: [],
  loading: false,
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
      .addDefaultCase((state) => {
        return state;
      });
  },
});

export const {} = roleSlice.actions;
export const roleReducer = roleSlice.reducer;
