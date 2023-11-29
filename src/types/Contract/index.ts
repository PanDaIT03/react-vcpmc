export interface IContract {
    docId: string
    authorized: string
    authorizingLegalEntity: string
    censored: boolean
    contractCode: string
    contractTypesId: string
    createdBy: string
    customer: string
    dateCreated: string
    effectiveDate: string
    expirationDate: string
    ownerShips: Array<string> | string
    status: string
};