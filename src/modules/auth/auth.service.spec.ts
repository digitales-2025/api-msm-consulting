/* eslint-disable @typescript-eslint/unbound-method */
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { describe } from 'node:test';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthenticateUserUseCase } from './use-cases/auth.use-case';
import { GenerateTokensUseCase } from './use-cases/generate-token.use-case';
import { InvalidateTokensUseCase } from './use-cases/invalidate-token.use-case';
import { ValidateRefreshTokenUseCase } from './use-cases/validate-refresh-token.use-case';

describe('AuthService', () => {
  let service: AuthService;
  let _configService: ConfigService;
  let authenticateUserUseCase: AuthenticateUserUseCase;
  let generateTokensUseCase: GenerateTokensUseCase;
  let validateRefreshTokenUseCase: ValidateRefreshTokenUseCase;
  let invalidateTokensUseCase: InvalidateTokensUseCase;
  let mockResponse: Partial<Response>;

  const mockUser: Partial<User> = {
    id: 'user-id',
    email: 'test@example.com',
    roles: ['user'],
  };

  beforeEach(async () => {
    mockResponse = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(<T>(key: string, defaultValue: T): T => {
              if (key === 'NODE_ENV') return 'development' as T;
              if (key === 'JWT_ACCESS_EXPIRES_IN') return '15m' as T;
              if (key === 'JWT_REFRESH_EXPIRES_IN') return '7d' as T;
              return defaultValue;
            }),
          },
        },
        {
          provide: AuthenticateUserUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GenerateTokensUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ValidateRefreshTokenUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: InvalidateTokensUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    _configService = module.get<ConfigService>(ConfigService);
    authenticateUserUseCase = module.get<AuthenticateUserUseCase>(
      AuthenticateUserUseCase,
    );
    generateTokensUseCase = module.get<GenerateTokensUseCase>(
      GenerateTokensUseCase,
    );
    validateRefreshTokenUseCase = module.get<ValidateRefreshTokenUseCase>(
      ValidateRefreshTokenUseCase,
    );
    invalidateTokensUseCase = module.get<InvalidateTokensUseCase>(
      InvalidateTokensUseCase,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should call authenticateUserUseCase with correct parameters', async () => {
      const email = 'test@example.com';
      const password = 'password';

      await service.validateUser(email, password);

      expect(authenticateUserUseCase.execute as jest.Mock).toHaveBeenCalledWith(
        email,
        password,
      );
    });

    it('should return the result from authenticateUserUseCase', async () => {
      const email = 'test@example.com';
      const password = 'password';
      (authenticateUserUseCase.execute as jest.Mock).mockResolvedValue(
        mockUser,
      );

      const result = await service.validateUser(email, password);

      expect(result).toBe(mockUser);
    });

    describe('signIn', () => {
      it('should generate tokens and set cookies', async () => {
        const tokens = {
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        };
        (generateTokensUseCase.execute as jest.Mock).mockResolvedValue(tokens);

        await service.signIn(mockUser as User, mockResponse as Response);

        expect(generateTokensUseCase.execute as jest.Mock).toHaveBeenCalledWith(
          mockUser.id,
          mockUser.email,
          mockUser.roles,
        );
        expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
      });
    });

    describe('signOut', () => {
      it('should invalidate tokens and clear cookies', async () => {
        const userId = 'user-id';

        await service.signOut(userId, mockResponse as Response);

        expect(
          invalidateTokensUseCase.execute as jest.Mock,
        ).toHaveBeenCalledWith(userId);
        expect(mockResponse.clearCookie).toHaveBeenCalledTimes(2);
      });
    });

    describe('refreshTokens', () => {
      it('should validate refresh token and generate new tokens', async () => {
        const refreshToken = 'valid-refresh-token';
        const tokens = {
          accessToken: 'new-access',
          refreshToken: 'new-refresh',
        };

        (validateRefreshTokenUseCase.execute as jest.Mock).mockResolvedValue(
          mockUser,
        );
        (generateTokensUseCase.execute as jest.Mock).mockResolvedValue(tokens);

        await service.refreshTokens(refreshToken, mockResponse as Response);

        expect(
          validateRefreshTokenUseCase.execute as jest.Mock,
        ).toHaveBeenCalledWith(refreshToken);
        expect(generateTokensUseCase.execute as jest.Mock).toHaveBeenCalled();
        expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
      });

      it('should throw UnauthorizedException when refresh token is invalid', async () => {
        const refreshToken = 'invalid-token';
        (validateRefreshTokenUseCase.execute as jest.Mock).mockRejectedValue(
          new Error('Invalid'),
        );

        await expect(
          service.refreshTokens(refreshToken, mockResponse as Response),
        ).rejects.toThrow(UnauthorizedException);

        expect(mockResponse.clearCookie).toHaveBeenCalledTimes(2);
      });
    });
  });
});
