export interface IAuthRepository {
  validateUser(email: string, password: string): Promise<any>;
  signIn(user: any, response: Response): Promise<void>;
  signOut(userId: string, response: Response): Promise<void>;
  refreshTokens(refreshToken: string, response: Response): Promise<void>;
}
