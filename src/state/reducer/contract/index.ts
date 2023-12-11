import { createSlice } from "@reduxjs/toolkit";

import {
  cancelContractAction,
  getContractsAction,
} from "~/state/thunk/contract";
import { IContract, IUserDetail } from "~/types";

interface InitType {
  contracts: (IContract & IUserDetail)[];
  loading: boolean;
  status: string;
}

const initialState: InitType = {
  contracts: [],
  loading: false,
  status: "get successfully" || "get failed" || "updated" || "update failed",
};

const contractSlice = createSlice({
  name: "contract",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getContractsAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(getContractsAction.fulfilled, (state, action) => {
        if (action.payload !== null) {
          let { contracts, users } = action.payload;
          const contractDetails: any[] = [];

          contracts.forEach((contract) => {
            users.forEach((user) => {
              if (contract.authorizedPerson === user.docId)
                contractDetails.push({ ...user, ...contract });
            });
          });

          state.contracts = contractDetails;
          state.loading = false;
          state.status = "get successfully";
        }
      })
      .addCase(getContractsAction.rejected, (state) => {
        state.loading = false;
        state.status = "get failed";
      })
      .addCase(cancelContractAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelContractAction.fulfilled, (state) => {
        state.loading = false;
        state.status = "updated";
      })
      .addCase(cancelContractAction.rejected, (state) => {
        state.loading = false;
      })
      .addDefaultCase((state) => {
        return state;
      });
  },
});

export const {} = contractSlice.actions;
export const contractReducer = contractSlice.reducer;
