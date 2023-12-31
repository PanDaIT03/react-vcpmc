import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  addContract,
  cancleContract,
  checkContractIsExisted,
  editContract,
  getContracts,
  saveContract,
} from "~/api/contract";
import { addUser, checkUserIsExisted, getUser } from "~/api/user";

interface IEditContract {
  id: string;
  date?: string;
  reason?: string;
  status?: string;
}

interface IAddContract {
  contract: any;
  user: any;
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

export const saveContractAction = createAsyncThunk(
  "contract/saveContract",
  async (contract: any, thunkAPI) => {
    saveContract(contract).then((response) => {
      thunkAPI.dispatch(getContractsAction());
    });
  }
);

export const addContractAction = createAsyncThunk(
  "contract/addContract",
  async ({ contract, user }: IAddContract, thunkAPI) => {
    console.log("contract", contract);
    console.log("user", user);

    const isUserExisted = (await checkUserIsExisted(user.email)) !== null;
    const isContractExisted =
      (await checkContractIsExisted(contract.contractCode)) !== null;

    const isValid = !isUserExisted && !isContractExisted;
    if (isValid) {
      const userId = await addUser(user).then();
      console.log(userId);

      const contractData = {
        ...contract,
        authorizedPerson: userId,
      };
      return await addContract(contractData).then(() =>
        thunkAPI.dispatch(getContractsAction())
      );
    }
  }
);
