import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Ada Lovelace' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 'ada@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
