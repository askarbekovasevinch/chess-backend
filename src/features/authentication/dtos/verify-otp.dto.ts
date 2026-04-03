import {IsString, IsEnum, Length} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {OtpType} from "@/core/enums";

export class VerifyOtpDto {
    @ApiProperty()
    @IsString()
    login: string;

    @ApiProperty()
    @IsString()
    @Length(6, 6)
    code: string;

    @ApiProperty({enum: OtpType})
    @IsEnum(OtpType)
    type: OtpType;
}
