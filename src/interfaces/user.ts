import { ISearch } from './utils';

export interface IUser {
  _id: string;
  avatar: string;
  name: string;
  email: string;
  username: string;
  role?: string;
  isPerformer?: boolean;
  isOnline?: boolean;
}

export interface IUserFormData {
  avatar?: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export interface IUserSearch extends ISearch {
  role?: string;
}
