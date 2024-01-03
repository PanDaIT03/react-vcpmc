import { User } from "../UserType";

export type IFeedback = {
  docId: string;
  userName: string;
  content: string;
  problem: string;
  dateTime: string;
  // user: Omit<IUserDetail, "companyName" | "position"> & {
  //   avatar: string;
  //   status?: string;
  //   companyName?: string;
  //   expirationDate?: string;
  //   role: Pick<Role, "docId" | "name">;
  // };
  user: User;
};
