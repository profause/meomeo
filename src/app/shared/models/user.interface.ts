import { Account } from "./account.interface";

export interface User {
  email?: string;
  id?: string | undefined;
  fullname?: string;
  mobileNumber?: string | null;
  account?: any|Account;
  role?: string;
  isAuthenticated?: boolean;
  dateCreated?: string;
  createdBy?: string;
}
