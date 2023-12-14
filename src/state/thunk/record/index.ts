import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCategoryId } from "~/api/category";

import { getContracts } from "~/api/contract";
import {
  approvalRecords,
  getCategories,
  getRecords,
  updateRecord,
} from "~/api/record";
import { IRecord } from "~/types";

interface IRecords {
  records: IRecord[];
  status: string;
  contractId: string;
  type: "contracts" | "records";
}

export const getRecordsAction = createAsyncThunk(
  "record/getRecords",
  async (contractId: string, thunkAPI) => {
    let records, categories, contracts;

    if (contractId !== "") records = await getRecords(contractId);
    else records = await getRecords();
    categories = await getCategories();
    contracts = await getContracts();

    if (records && categories)
      return {
        records,
        categories,
        contracts,
      };
    return null;
  }
);

export const updateRecordsAction = createAsyncThunk(
  "record/updateRecords",
  async ({ records, status, contractId, type }: IRecords, thunkAPI) => {
    records.map(
      async (record) =>
        await approvalRecords(record.docId, status, type).then(() =>
          thunkAPI.dispatch(getRecordsAction(contractId))
        )
    );
  }
);

export const updateRecordAction = createAsyncThunk(
  "record/updateRecords",
  async (
    data: Pick<
      IRecord,
      "nameRecord" | "ISRCCode" | "singer" | "author" | "producer" | "category"
    > & { docId?: string },
    thunkAPI
  ) => {
    if (
      typeof data.category === "undefined" ||
      typeof data.docId === "undefined"
    )
      return;

    const { docId, category } = data;
    delete data.docId;
    delete data.category;

    const categoriesId = await getCategoryId(category);
    const recordUpdate = {
      ...data,
      categoriesId: categoriesId,
    };

    return await updateRecord(docId, recordUpdate);
  }
);
