import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpCode } from './otp.entity';
@Module({ imports: [TypeOrmModule.forFeature([OtpCode])], exports: [TypeOrmModule] })
export class OtpModule {}
