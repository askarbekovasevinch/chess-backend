import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {AuthController} from "@/features/authentication/controllers/authentication.controller";
import {AuthService} from "@/features/authentication/services/authentication.service";
import {JwtStrategy} from './strategies/jwt.strategy';
import {User} from '../users/user.entity';
import {OtpCode} from '../otp/otp.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, OtpCode]),
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                secret: config.get('JWT_SECRET', 'secret'),
                signOptions: {expiresIn: config.get('JWT_EXPIRES_IN', '15m')},
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {
}
