import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MatchType, WinnerType} from "@/core/enums";

export class CreateMatchDto {
  @ApiProperty() @IsNumber() secondUserId: number;
  @ApiProperty({ enum: MatchType }) @IsEnum(MatchType) type: MatchType;
}

export class FinishMatchDto {
  @ApiPropertyOptional({ enum: WinnerType }) @IsOptional() @IsEnum(WinnerType) winner?: WinnerType;
  @ApiPropertyOptional() @IsOptional() @IsString() pgn?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() duration?: number;
}
