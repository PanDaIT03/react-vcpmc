import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAuthorizedContract } from "~/api/authorizedPartner";

export const getAuthorizedContracts = createAsyncThunk(
  "authorizedContract/getAuthorizedContracts",
  async () => {
    return await getAuthorizedContract();
  }
);
