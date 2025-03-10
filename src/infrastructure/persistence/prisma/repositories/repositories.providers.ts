import { Provider } from '@nestjs/common';
import { UserRepository } from './user/user.repository';

export const REPOSITORIES_PROVIDERS: Provider[] = [UserRepository];
