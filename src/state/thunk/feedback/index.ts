import { createAsyncThunk } from "@reduxjs/toolkit";
import { getFeedbackList, sendFeedbackAPI } from "~/api/feedback";
import { IFeedback } from "~/types/FeedbackType";

export const sendFeedback = createAsyncThunk(
  "feedback/sendFeedback",
  async (feedback: Omit<IFeedback, "docId" | "user"> & { usersId: string }) => {
    await sendFeedbackAPI(feedback);
  }
);

export const getFeedbacks = createAsyncThunk(
  "feedback/getFeedbacks",
  async () => {
    return await getFeedbackList();
  }
);
