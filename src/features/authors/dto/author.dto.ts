import {IsString, MaxLength} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class CreateAuthorDto {
    @ApiProperty()
    @IsString()
    @MaxLength(64)
    fullName: string;
}

export class UpdateAuthorDto {
    @ApiProperty({required: false})
    @IsString() @MaxLength(64)
    fullName?: string;
}
