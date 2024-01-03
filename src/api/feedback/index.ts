import { addDoc, collection, getDocs } from "firebase/firestore";
import { fireStoreDatabase } from "~/config/firebase";
import { IFeedback } from "~/types/FeedbackType";
import { getUserFeedbackList } from "../user";

export const sendFeedbackAPI = async (
  feedback: Omit<IFeedback, "docId" | "user"> & { usersId: string }
) => {
  await addDoc(collection(fireStoreDatabase, "feedbacks"), feedback);
};

export const getFeedbackList = async () => {
  const resultSnapshot = await getDocs(collection(fireStoreDatabase, "feedbacks"));
  const userList = await getUserFeedbackList();

  return resultSnapshot.docs.map((doc) => {
    const user =
      userList.find((user) => user.docId === doc.data().usersId) ||
      ({} as Pick<IFeedback, "user">);

    return {
      docId: doc.id,
      userName: doc.data().userName,
      content: doc.data().content,
      problem: doc.data().problem,
      dateTime: doc.data().dateTime,
      user: user,
    };
  });
};
