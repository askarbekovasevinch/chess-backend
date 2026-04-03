import { IsEnum, IsNumber, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReportType} from "@/core/enums";

export class CreateReportDto {
  @ApiProperty()
  @IsNumber()
  targetId: number;

  @ApiProperty({ enum: ReportType })
  @IsEnum(ReportType)
  type: ReportType;

  @ApiProperty()
  @IsString()
  @MaxLength(256)
  reason: string;
}
