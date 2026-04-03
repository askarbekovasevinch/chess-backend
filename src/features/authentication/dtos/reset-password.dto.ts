import {IsString, MinLength} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class ResetPasswordDto {
    @ApiProperty()
    @IsString()
    login: string;

    @ApiProperty()
    @IsString()
    @MinLength(6, {message: 'OTP must be 6 chars'})
    otp: string;

    @ApiProperty()
    @IsString()
    @MinLength(8)
    newPassword: string;
}
