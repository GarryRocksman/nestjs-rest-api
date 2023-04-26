import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController, UserController],
  providers: [
    AuthService,
    JwtStrategy,
    UserService,
  ],
})
export class AuthModule {}
