export interface Section {
  id?: string | undefined;
  name?: string;
  accountId?: string;
  dateCreated?: string;
  createdBy?: string;
  numberOfTables?: number;
  tableNamePrefix?: string;
  tableNameSuffix?: string;
  tableNamePattern?: string;
}
