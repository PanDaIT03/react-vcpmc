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
}
