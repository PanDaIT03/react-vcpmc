import { IContract } from "../Contract";

export type IRecord = {
  docId: string;
  imageURL: string;
  ISRCCode: string;
  approvalDate: string;
  approvalBy: string;
  audioLink: string;
  author: string;
  categoriesId: string;
  contractId: string;
  contractStatus: string;
  createdBy: string;
  createdDate: string;
  format: string;
  title: string;
  producer: string;
  singer: string;
  time: string;
  expirationDate: string;
  status: string;
  category?: string;
  contract?: IContract;
};

export interface ICategory {
  docId: string;
  name: string;
}
