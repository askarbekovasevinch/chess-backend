import {IsString, IsNumber, IsOptional, IsBoolean, Min, MaxLength} from 'class-validator';
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {Type} from 'class-transformer';

export class CreateCourseDto {
    @ApiProperty()
    @IsNumber()
    authorId: number;

    @ApiProperty()
    @IsNumber()
    categoryId: number;

    @ApiProperty()
    @IsNumber()
    languageId: number;

    @ApiProperty()
    @IsNumber()
    difficultyId: number;

    @ApiProperty()
    @IsString()
    @MaxLength(128)
    title: string;

    @ApiProperty()
    @IsString()
    @MaxLength(128)
    image: string;

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price: number;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsNumber() @Min(0)
    newPrice?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;
}

export class UpdateCourseDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    authorId?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    categoryId?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    languageId?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    difficultyId?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(128)
    title?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    image?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsNumber() @Min(0)
    price?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsNumber() @Min(0)
    newPrice?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isPublished?: boolean;
}

export class CourseQueryDto {
    @ApiPropertyOptional()
    @IsOptional() @Type(() => Number)
    @IsNumber()
    page?: number = 1;

    @ApiPropertyOptional()
    @IsOptional() @Type(() => Number)
    @IsNumber()
    limit?: number = 20;

    @ApiPropertyOptional()
    @IsOptional() @Type(() => Number)
    @IsNumber()
    categoryId?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    languageId?: number;

    @ApiPropertyOptional()
    @IsOptional() @Type(() => Number)
    @IsNumber()
    difficultyId?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    search?: string;
}
