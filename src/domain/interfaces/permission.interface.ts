export interface IPermission {
  id: string;
  name: string;
  description?: string | null;
  resource: string;
  action: string;
  createdAt: Date;
  updatedAt: Date;
}
