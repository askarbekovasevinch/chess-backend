import {IsString, IsEmail, IsEnum, IsOptional, MinLength, MaxLength, IsDateString} from 'class-validator';
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {LoginType} from "@/core/enums";
import {type} from "node:os";

export class RegisterDto {
    @ApiProperty()
    @IsString()
    @MaxLength(64)
    fullName: string;

    @ApiProperty()
    @IsString()
    @MaxLength(64)
    login: string;

    @ApiProperty({enum: LoginType})
    @IsEnum(LoginType)
    loginType: LoginType;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    birthDate?: string;
}
