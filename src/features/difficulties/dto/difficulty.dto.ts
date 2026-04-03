import {IsString, MaxLength} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class CreateDifficultyDto {
    @ApiProperty()
    @IsString()
    @MaxLength(32)
    title: string;

    @ApiProperty()
    @IsString()
    @MaxLength(128)
    icon: string;
}

export class UpdateDifficultyDto {
    @ApiProperty({required: false})
    @IsString() @MaxLength(32)
    title?: string;

    @ApiProperty({required: false})
    @IsString() @MaxLength(128)
    icon?: string;
}
