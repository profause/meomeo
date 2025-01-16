import { Subscription } from './subscription.interface';

export interface Account {
  id?: string | undefined;
  name?: string;
  address?: string;
  dateCreated?: string;
  createdBy?: string;
  subscription?: Subscription;
  isTrialPeriodDue?: boolean;
  status?: string;
  logo?: string;
}
