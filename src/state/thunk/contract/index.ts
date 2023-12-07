import { createAsyncThunk } from "@reduxjs/toolkit";

import { cancleContract, editContract, getContracts } from "~/api/contract";
import { getUser } from "~/api/user";

interface IEditContract {
  id: string;
  date?: string;
  reason?: string;
  status?: string;
}

export const getContractsAction = createAsyncThunk(
  "contract/getContracts",
  async (_, thunkAPI) => {
    const contracts = await getContracts();
    const users = await getUser();

    if (contracts && users) {
      return {
        contracts,
        users,
      };
    }
    return null;
  }
);

export const editContractAction = createAsyncThunk(
  "contract/editContract",
  async ({ date, status, id }: IEditContract, thunkAPI) => {
    if (typeof date !== "undefined" && typeof status !== "undefined")
      editContract(date, status, id);
  }
);

export const cancelContractAction = createAsyncThunk(
  "contract/cancelContract",
  async ({ reason, status, id }: IEditContract, thunkAPI) => {
    if (typeof status !== "undefined" && typeof reason !== "undefined")
      cancleContract(id, reason, status);
  }
);
