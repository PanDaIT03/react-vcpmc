import { createSlice } from "@reduxjs/toolkit";
import {
  addDevice,
  changePasswordDevice,
  changeStatusDevice,
  deleteDevices,
  getDeviceList,
  restoreMemory,
  updateDevice,
} from "~/state/thunk/device";
import { IDevice } from "~/types/DeviceType";

interface InitialStateType {
  devices: IDevice[];
  loading: boolean;
}

const initialState: InitialStateType = {
  devices: [],
  loading: false,
};

export const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDeviceList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getDeviceList.fulfilled, (state, action) => {
      state.loading = false;

      if (action.payload) state.devices = action.payload;
    });
    builder.addCase(getDeviceList.rejected, (state, action) => {
      state.loading = false;
      throw new Error(`${action.error.name}: ${action.error.message}`);
    });
    builder.addCase(changeStatusDevice.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(changeStatusDevice.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(changeStatusDevice.rejected, (state, action) => {
      state.loading = false;
      throw new Error(`${action.error.name}: ${action.error.message}`);
    });
    builder.addCase(updateDevice.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateDevice.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(updateDevice.rejected, (state, action) => {
      state.loading = false;
      throw new Error(`${action.error.name}: ${action.error.message}`);
    });
    builder.addCase(restoreMemory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(restoreMemory.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(restoreMemory.rejected, (state, action) => {
      state.loading = false;
      throw new Error(`${action.error.name}: ${action.error.message}`);
    });
    builder.addCase(changePasswordDevice.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(changePasswordDevice.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(changePasswordDevice.rejected, (state, action) => {
      state.loading = false;
      throw new Error(`${action.error.name}: ${action.error.message}`);
    });
    builder.addCase(addDevice.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addDevice.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(addDevice.rejected, (state, action) => {
      state.loading = false;
      throw new Error(`${action.error.name}: ${action.error.message}`);
    });
    builder.addCase(deleteDevices.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteDevices.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(deleteDevices.rejected, (state, action) => {
      state.loading = false;
      throw new Error(`${action.error.name}: ${action.error.message}`);
    });
  },
});

export const deviceReducer = deviceSlice.reducer;
