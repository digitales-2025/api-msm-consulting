export interface IUser {
  id: string;
  email: string;
  password: string;
  fullName: string;
  roles: string[];
  refreshToken: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
