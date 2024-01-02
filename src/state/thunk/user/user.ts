import { createAsyncThunk } from "@reduxjs/toolkit";

import { IUser, IRole } from "~/types";
import {
  changePasswordStatusUserById,
  checkLogin,
  getDocIdByField,
  getUserByDocId,
  resetPassword,
  updateUser,
} from "~/api/user";

interface IUpdatePassword {
  email?: string;
  id?: string;
  password: string;
}

export const checkLoginAction = createAsyncThunk(
  "user/checkLogin",
  async (
    data: Pick<IUser, "userName" | "password"> & { roles: IRole[] },
    thunkAPI
  ) => {
    const { roles } = data;
    const userId = await checkLogin(data);

    if (userId) {
      const user = await getUserByDocId(userId);
      return {
        userId,
        user,
        roles,
      };
    }
    return null;
  }
);

export const resetPasswordAction = createAsyncThunk(
  "user/resetPassword",
  async (data: IUpdatePassword, thunkAPI) => {
    if (data.id === undefined && data.email === undefined) return;

    if (data.email) var docId = await getDocIdByField("email", data.email);
    else var docId = data.id;

    let isUpdateSuccess = false;
    docId &&
      (await resetPassword(docId, data.password).then(() => {
        isUpdateSuccess = true;
      }));

    if (isUpdateSuccess && docId) return await getUserByDocId(docId);
  }
);

export const updateUserAction = createAsyncThunk(
  "user/updateUser",
  async (data: any, thunkAPI) => {
    const userData = { ...data };

    let isUpdateSuccess = false;
    await updateUser(userData).then(() => {
      isUpdateSuccess = true;
    });

    if (isUpdateSuccess) return await getUserByDocId(data.docId);
  }
);

export const changePasswordStatusUser = createAsyncThunk(
  "user/changePasswordStatusUserById",
  async ({
    docId,
    password,
    status,
    navigate,
  }: Pick<IUser, "password" | "docId"> & {
    status: string;
    navigate: () => void;
  }) => {
    await changePasswordStatusUserById({ docId, password, status });

    navigate();
  }
);
