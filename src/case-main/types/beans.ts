export interface IResponseData<T> {
  data: T;
  result: 0 | 1 | 2;
  message?: string;
}
export interface IDepartment {
  id: number;
  no: string;
  name: string;
  descr: string;
  parent: IDepartment;
  createDt: string;
  extend: Record<string, any>;
  children: IDepartment[];
}
export interface IRole {
  id: number;
  name: string;
  description: string;
  privileges: string[];
  department: IDepartment;
  extend: Record<string, any>;
}
export interface IUser {
  id: number;
  role: IRole;
  username: string;
  name: string;
  phone: string;
  pwd: string;
  gender: number;
  image: string;
  address: string;
  createDt: string;
  off: number;
  extend: Record<string, any>;
}
