import { Address } from './address';

export type User = {
  Id: string;
  FirstName: string;
  LastName: string;
  Email: string;
  CreatedAt: string;
  Addresses: Array<Address>;
};
