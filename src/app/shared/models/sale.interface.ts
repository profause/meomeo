import { User } from './user.interface';

export interface Sale {
  attendant?: User;
  accountId?: string;
  id?: string | undefined;
  dateCreated?: string;
  createdBy?: string;
  customerName?: string;
  customerMobileNumber?: string;
  vehicleRegistrationNumber?: string;
  washType?: string;
  amountPaid?: number;
}
