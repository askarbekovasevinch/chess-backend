import {IsString, MaxLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class SignInDto {
    @IsString()
    @MaxLength(64)
    @ApiProperty()
    password!: string;
}