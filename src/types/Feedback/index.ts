import { Role } from "../RoleType";
import { IUserDetail } from "../UserType";

export type IFeedback = {
  docId: string;
  userName: string;
  content: string;
  problem: string;
  dateTime: string;
  user: Omit<IUserDetail, "companyName" | "position"> & {
    avatar: string;
    status?: string;
    companyName?: string;
    expirationDate?: string;
    role: Pick<Role, "docId" | "name">;
  };
  // user: {
  //   docId: string;
  //   avatar: string;
  //   bank: string;
  //   bankNumber: string;
  //   dateOfBirth: string;
  //   dateRange: string;
  //   email: string;
  //   firstName: string;
  //   gender: string;
  //   idNumber: string;
  //   issuedBy: string;
  //   lastName: string;
  //   nationality: string;
  //   password: string;
  //   phoneNumber: string;
  //   residence: string;
  //   rolesId: string;
  //   taxCode: string;
  //   userName: string;
  //   role: Pick<Role, "docId" | "name">;
  //   companyName?: string;
  //   status?: string;
  //   expirationDate?: string;
  // };
};
