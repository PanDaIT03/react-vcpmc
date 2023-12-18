export interface IUser {
  docId: string;
  avatar: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  userName: string;
  password: string;
  rolesId: string;
  role?: string;
}

export interface IUserDetail {
  docId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  phoneNumber: string;
  idNumber: string;
  dateRange: string;
  issuedBy: string;
  taxCode: string;
  residence: string;
  bank: string;
  bankNumber: string;
  email: string;
  userName: string;
  password: string;
  companyName: string;
  position: string;
}
