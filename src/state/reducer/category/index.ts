import { createSlice } from "@reduxjs/toolkit";

import {
  addCategory,
  getCategories,
  updateCategories,
} from "~/state/thunk/category";
import { ICategory } from "~/types/CategoryType";

interface InitialStateType {
  categoryList: Array<ICategory>;
  loading: boolean;
}

const initialState: InitialStateType = {
  categoryList: [],
  loading: false,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.loading = false;

      if (action.payload) state.categoryList = action.payload;
    });
    builder.addCase(getCategories.rejected, (state, action) => {
      state.loading = false;
      throw new Error(`${action.error.name}: ${action.error.message}`);
    });
    builder.addCase(updateCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateCategories.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(updateCategories.rejected, (state, action) => {
      state.loading = false;
      throw new Error(`${action.error.name}: ${action.error.message}`);
    });
    builder.addCase(addCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addCategory.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(addCategory.rejected, (state, action) => {
      state.loading = false;
      throw new Error(`${action.error.name}: ${action.error.message}`);
    });
  },
});

export const { reducer: categoryReducer } = categorySlice;
