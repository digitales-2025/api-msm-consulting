import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'The name of the permission',
    example: 'users:create',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The description of the permission',
    example: 'Create a new user',
  })
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The resource of the permission',
    example: 'users',
  })
  @IsString()
  resource: string;

  @ApiProperty({
    description: 'The action of the permission',
    example: 'create',
  })
  @IsString()
  action: string;
}
