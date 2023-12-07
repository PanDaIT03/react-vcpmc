import { createAsyncThunk } from "@reduxjs/toolkit";

import { approvalRecords, getCategories, getRecords } from "~/api/record";
import { IRecord } from "~/types";

interface IRecords {
  records: IRecord[];
  status: string;
  contractId: string;
}

export const getRecordsAction = createAsyncThunk(
  "record/getRecords",
  async (contractId: string, thunkAPI) => {
    const records = await getRecords(contractId);
    const categories = await getCategories();

    if (records && categories)
      return {
        records,
        categories,
      };
    return null;
  }
);

export const updateRecordsAction = createAsyncThunk(
  "record/updateRecords",
  async ({ records, status, contractId }: IRecords, thunkAPI) => {
    if (records && contractId)
      records.map(
        async (record) =>
          await approvalRecords(record.docId, status).then(() =>
            thunkAPI.dispatch(getRecordsAction(contractId))
          )
      );
  }
);
