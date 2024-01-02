import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addCategoryAPI,
  getCategoryList,
  updateCategoriesById,
} from "~/api/category";
import { ICategory } from "~/types";

export const getCategories = createAsyncThunk(
  "type/getCategories",
  async () => {
    return await getCategoryList();
  }
);

export const updateCategories = createAsyncThunk(
  "type/updateCategories",
  async (
    { categories, navigate }: { categories: ICategory[]; navigate: () => void },
    thunkAPI
  ) => {
    await updateCategoriesById(categories);
    await thunkAPI.dispatch(getCategories());

    navigate();
  }
);

export const addCategory = createAsyncThunk(
  "type/addCategory",
  async ({ category }: { category: ICategory }, thunkAPI) => {
    await addCategoryAPI(category);
    thunkAPI.dispatch(getCategories());
  }
);
