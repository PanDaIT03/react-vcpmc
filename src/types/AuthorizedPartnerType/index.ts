import { IContract } from "../ContractType";
import { IRecord, RecordPlays } from "../RecordType";
import { Role } from "../RoleType";
import { IUser, User } from "../UserType";

export interface AuthorizedContract {
  docId: string;
  authorized: string;
  authorizedPerson: string;
  authorizingLegalEntity: string;
  censored: boolean;
  contractCode: string;
  contractTypesId: string;
  createdBy: string;
  customer: string;
  dateCreated: string;
  effectiveDate: string;
  expirationDate: string;
  ownerShips: Array<string> | string;
  reason: string;
  status: string;
  royalties: string;
  CPM: string;
  administrativeFee: string;
  forControlDate: string;
}

export interface RecordDetail {
  records: IRecord;
  recordPlays: Array<RecordPlays>;
  totalPlay: number;
}

// export type AuthorizedContractDetail = Omit<
//   AuthorizedContract,
//   "authorizedPerson" | "createdBy"
// > & {
//   authorizedPerson: Omit<IUser, "role"> & { status: string } & {
//     role: Pick<Role, "docId" | "name">;
//   };
//   createdBy: IUser;
// };

export type AuthorizedContractDetail = Omit<IContract, 'authorizedPerson' | 'createdBy' | 'approvalDate'> & {
  authorizedPerson: User;
  createdBy: User;
}

export interface ContractDetail {
  contract: AuthorizedContractDetail;
  records: RecordDetail[];
  totalPlay: number;
  revenue: number;
  royalties: number;
  date: string;
  administrativeFee: number;
}
