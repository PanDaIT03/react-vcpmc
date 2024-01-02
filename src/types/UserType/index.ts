import { IRole, Role } from "../RoleType";

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

export interface User {
  avatar: string;
  bank: string;
  bankNumber: string;
  dateOfBirth: string;
  dateRange: string;
  email: string;
  firstName: string;
  gender: string;
  idNumber: string;
  issuedBy: string;
  lastName: string;
  nationality: string;
  password: string;
  phoneNumber: string;
  residence: string;
  rolesId: string;
  taxCode: string;
  userName: string;
  role: Pick<Role, 'docId' | 'name'>;
  docId: string;
  companyName?: string;
  status?: string;
  expirationDate?: string;
}

export type UserInfo = Pick<
  User, 'docId' | 'userName' | 'email' | 'phoneNumber'
  | 'rolesId' | 'firstName' | 'lastName' | 'password'
> & { fullName: string, confirmPassword: string, status: string };
