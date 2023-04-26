import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    const { email, password } = dto;
    const hashedPassword = await argon.hash(
      password,
    );

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      return this.createToken(
        user.id,
        user.email,
      );
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'Email already exists',
          );
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

    if (!user) {
      throw new BadRequestException(
        'Invalid credentials',
      );
    }

    const valid = await argon.verify(
      user.password,
      dto.password,
    );

    if (!valid) {
      throw new BadRequestException(
        'Invalid credentials',
      );
    }

    return this.createToken(user.id, user.email);
  }

  async createToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { userId, email };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.sign(payload, {
      secret,
      expiresIn: '1d',
    });

    return {
      access_token: token,
    };
  }
}
