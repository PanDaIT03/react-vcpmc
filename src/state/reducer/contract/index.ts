import { createSlice } from "@reduxjs/toolkit";

import { getContractAction } from "~/state/thunk/contract";
import { IContract, IContractDetail } from "~/types";

interface InitType {
    contracts: (IContract & IContractDetail)[]
    loading: boolean
    status: string
};

const initialState: InitType = {
    contracts: [],
    loading: false,
    status: "get successfully" || "get failed"
};

const contractSlice = createSlice({
    name: "contract",
    initialState: initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(getContractAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(getContractAction.fulfilled, (state, action) => {
                if (action.payload !== null) {
                    const contractArray: any[] = [];
                    const { contracts, contractDetails } = action.payload;

                    if (contracts && contractDetails) {
                        contracts.map(contract => {
                            const detail = contractDetails.find(item => {
                                return item.docId === contract.contractDetailsId;
                            });

                            contractArray.push({ ...contract, ...detail });
                        });
                    }
                    state.contracts = contractArray;
                    state.loading = false;
                    state.status = "get successfully";
                }
            })
            .addCase(getContractAction.rejected, (state) => {
                state.loading = true;
                state.status = "get failed";
            })
            .addDefaultCase(state => {
                return state;
            })
    },
});

export const { } = contractSlice.actions;
export const contractReducer = contractSlice.reducer;