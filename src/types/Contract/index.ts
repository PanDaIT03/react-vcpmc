export interface IContract {
    docId: string
    censored: string
    contractCode: string
    contractDetailsId: string
    contractTypesId: string
    createdBy: string
    customer: string
    dateCreated: string
    effectiveDate: string
    expirationDate: string
    ownerShip: string
    status: string
};

export interface IContractDetail {
    docId: string
    authorizedName: string
    authorizingLegalEntity: string
    citizenId: string
    dateRange: string
    issuedBy: string
    nationality: string
    note: string
    phoneNumber: string
    position: string
    representative: string
    residence: string
    taxCode: string
};