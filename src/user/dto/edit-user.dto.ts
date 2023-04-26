import { Optional } from '@nestjs/common';
import {
  IsEmail,
  IsString,
} from 'class-validator';

export class EditUserDto {
  @IsEmail()
  @Optional()
  email?: string;

  @IsString()
  @Optional()
  firstName?: string;

  @IsString()
  @Optional()
  lastName?: string;
}
