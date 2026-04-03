import {IsString, IsEnum, IsOptional, MinLength} from 'class-validator';
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {LoginType} from "@/core/enums";

export class LoginDto {
    @ApiProperty()
    @IsString()
    login: string;

    @ApiProperty({enum: LoginType})
    @IsEnum(LoginType)
    loginType: LoginType;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string;
}
