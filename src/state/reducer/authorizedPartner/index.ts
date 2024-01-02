import { createSlice } from "@reduxjs/toolkit";
import { getAuthorizedContracts } from "~/state/thunk/authorizedPartner";
import {
  AuthorizedContractDetail,
  ContractDetail,
} from "~/types/AuthorizedPartnerType";

interface InitialStateType {
  contracts: AuthorizedContractDetail[];
  loading: boolean;
  contractDetails: ContractDetail[];
}

const initialState: InitialStateType = {
  contracts: [],
  loading: false,
  contractDetails: [],
};

const authorizedContractSlice = createSlice({
  name: "authorizedContractSlice",
  initialState,
  reducers: {
    setContractsDetail: (state, action) => {
      state.contractDetails = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAuthorizedContracts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAuthorizedContracts.fulfilled, (state, action) => {
      state.loading = false;
      state.contracts = action.payload;
    });
    builder.addCase(getAuthorizedContracts.rejected, (state, action) => {
      state.loading = false;
      throw new Error(`${action.error.name}: ${action.error.message}`);
    });
  },
});

export const authorizedContractReducer = authorizedContractSlice.reducer;
export const { setContractsDetail } = authorizedContractSlice.actions;
