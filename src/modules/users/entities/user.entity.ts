export class User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  roles: string[];
  refreshToken: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  [key: string]: any; // Para propiedades adicionales
}
