import {IsString, Length, MaxLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class SetPasswordDto{
    @IsString()
    @MaxLength(64)
    @ApiProperty()
    login!: string;

    @IsString()
    @Length(6, 6)
    @ApiProperty()
    code!: string;

    @IsString()
    @MaxLength(2)
    @ApiProperty()
    password!: string;

}