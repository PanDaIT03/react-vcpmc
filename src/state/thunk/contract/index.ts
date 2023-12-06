import { createAsyncThunk } from "@reduxjs/toolkit";

import { editContract, getContracts } from "~/api/contract";
import { getUser } from "~/api/user";

interface IEditContract {
  date: string;
  status: string;
  id: string;
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
  "contract/editContracts",
  async ({ date, status, id }: IEditContract, thunkAPI) => {
    editContract(date, status, id).then(
      async () => await thunkAPI.dispatch(getContractsAction())
    );
  }
);
