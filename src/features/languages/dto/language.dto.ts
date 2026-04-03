import {IsString, Length} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class CreateLanguageDto {
    @ApiProperty()
    @IsString()
    @Length(1, 32)
    title: string;

    @ApiProperty()
    @IsString()
    @Length(2, 2)
    code: string;
}

export class UpdateLanguageDto {
    @ApiProperty({required: false})
    @IsString() @Length(1, 32)
    title?: string;

    @ApiProperty({required: false})
    @IsString()
    @Length(2, 2) c
    ode?: string;
}
