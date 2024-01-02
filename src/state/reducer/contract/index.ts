import { createSlice } from "@reduxjs/toolkit";

import {
  addContractAction,
  cancelContractAction,
  getContractsAction,
} from "~/state/thunk/contract";
import { ContractDetail, IContract, IUserDetail } from "~/types";

interface InitType {
  contracts: (IContract & IUserDetail)[];
  loading: boolean;
  status: string;
  contractDetails: Array<ContractDetail>;
}

const initialState: InitType = {
  contracts: [],
  contractDetails: [],
  loading: false,
  status:
    "get successfully" ||
    "get failed" ||
    "updated" ||
    "update failed" ||
    "insert successfully" ||
    "insert failed" ||
    "",
};

const contractSlice = createSlice({
  name: "contract",
  initialState: initialState,
  reducers: {
    setContractsDetail: (state, action) => {
      state.contractDetails = action.payload;
    }
  },
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
      .addCase(addContractAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(addContractAction.fulfilled, (state) => {
        state.loading = false;
        state.status = "insert success";
      })
      .addCase(addContractAction.rejected, (state) => {
        state.loading = false;
        state.status = "insert failed";
      })
      .addDefaultCase((state) => {
        return state;
      });
  },
});

export const { setContractsDetail } = contractSlice.actions;
export const contractReducer = contractSlice.reducer;
