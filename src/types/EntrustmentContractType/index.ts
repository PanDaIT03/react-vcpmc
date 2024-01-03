import { IRecord, RecordPlays } from "../RecordType";
import { User } from "../UserType";

export interface ETMContractType {
  docId: string;
  name: string;
  revenuePercent: number;
  applyDate: string;
}

export interface Quarterly {
  quarter: string;
  time: string;
}

export type OwnRecord = Omit<
  IRecord,
  "approvalsId" | "category" | "status"  | "contractStatus"
> & {
  totalPlay: number;
};

export type EtmContractForControl = EtmContract & {
  records: Array<OwnRecord>;
  totalPlay: number;
  productionRight: number;
  performanceRight: number;
  vcpmcRight: number;
  CPM: number;
  checkpointDate: string;
  unDistributedRevenue: number;
  statusForControl: string;
  administrativeFee: number;
  recordPlay: Array<RecordPlays>;
};

export interface EtmContract {
  docId: string;
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

export type EtmContractDetail = Omit<EtmContract, "createdBy" | "usersId"> & {
  createdBy: User;
  user: User & { status: string };
};
