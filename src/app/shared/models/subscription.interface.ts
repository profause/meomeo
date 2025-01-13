export interface Subscription {
  id?: string | undefined;
  name?: string;
  description?: string;
  benefits?: string[];
  startDate?: string;
  endDate?: string;
  nextPaymentDate?: string;
  price?: number;
  code?: string;
  token?: string;
  status?: string;
  configuration?: any;
}
