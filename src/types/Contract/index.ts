import { IRecord } from "../Record";
import { RecordPlays } from "../RecordPlay";
import { User } from "../UserType";

export interface IOwnerShip {
  name: string;
  value: number;
}

export interface IContract {
  docId: string;
  authorized: string;
  authorizedPerson: string;
  authorizingLegalEntity: string;
  approvalDate: string;
  censored: boolean;
  contractCode: string;
  contractTypesId: string;
  createdBy: string;
  customer: string;
  dateCreated: string;
  effectiveDate: string;
  expirationDate: string;
  ownerShips: Array<IOwnerShip>;
  reason: string;
  status: string;
  royalties: string;
  CPM: string;
  administrativeFee: string;
  forControlDate: string;
}

export interface IEntrustmentContract {
  id: string;
  code: string;
  createdBy: string;
  createdDate: string;
  companyName: string;
  distributionValue: string;
  effectiveDate: string;
  expirationDate: string;
  name: string;
  status: string;
  type: string;
  value: string;
  position: string;
  usersId: string;
  playValue: string;
  employeeIds?: Array<string>;
}

export interface RecordDetail {
  records: IRecord;
  recordPlays: Array<RecordPlays>;
  totalPlay: number;
}

export type AuthorizedContractDetail = Omit<IContract, 'authorizedPerson' | 'createdBy'> & {
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