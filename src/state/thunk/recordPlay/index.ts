import { createAsyncThunk } from "@reduxjs/toolkit";
import { getRecordPlayList } from "~/api/recordPlay";

export const getRecordPlays = createAsyncThunk(
    'recordPlay/getRecordPlays',
    async () => {
        return await getRecordPlayList();
    }
);