import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addDeviceAPI,
  changePasswordDeviceById,
  changeStatusDeviceById,
  deleteDevicesAPI,
  getDevices,
  restoreMemoryById,
  updateDeviceById,
} from "~/api/device";
import { IDevice } from "~/types/DeviceType";

export const getDeviceList = createAsyncThunk(
  "device/getDeviceList",
  async () => {
    return await getDevices();
  }
);

export const changeStatusDevice = createAsyncThunk(
  "device/changeStatusDevice",
  async ({ data }: { data: Pick<IDevice, "status" | "docId">[] }, thunkAPI) => {
    await changeStatusDeviceById({ data });
    thunkAPI.dispatch(getDeviceList());
  }
);

export const updateDevice = createAsyncThunk(
  "device/updateDevice",
  async ({
    data,
    navigate,
  }: {
    data: Pick<
      IDevice,
      | "docId"
      | "status"
      | "SKUID"
      | "macAddress"
      | "name"
      | "operatingLocation"
      | "userName"
    >;
    navigate: () => void;
  }) => {
    await updateDeviceById({ data });
    navigate();
  }
);

export const restoreMemory = createAsyncThunk(
  "device/restoreMemory",
  async (data: Pick<IDevice, "docId" | "memory">, thunkAPI) => {
    if (data.docId === "") return;
    await restoreMemoryById(data);
    thunkAPI.dispatch(getDeviceList());
  }
);

export const changePasswordDevice = createAsyncThunk(
  "device/changePasswordDevice",
  async (data: Pick<IDevice, "docId" | "password">, thunkAPI) => {
    if (data.docId === "") return;
    await changePasswordDeviceById(data);
    thunkAPI.dispatch(getDeviceList());
  }
);

export const addDevice = createAsyncThunk(
  "device/addDevice",
  async ({
    data,
    navigate,
  }: {
    data: Omit<IDevice, "lastestVersion" | "docId">;
    navigate: () => void;
  }) => {
    await addDeviceAPI(data);
    navigate();
  }
);

export const deleteDevices = createAsyncThunk(
  "device/deleteDevice",
  async (data: Array<Pick<IDevice, "docId">>, thunkAPI) => {
    await deleteDevicesAPI(data);
    thunkAPI.dispatch(getDeviceList());
  }
);
