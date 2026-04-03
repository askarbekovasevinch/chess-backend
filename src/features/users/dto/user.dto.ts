import { IsString, IsOptional, MaxLength, IsDateString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role} from "@/core/enums";

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(64)
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(128)
  profileImage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  birthDate?: string;
}



export class UpdateUserRoleDto {
  @ApiPropertyOptional({ enum: Role }) @IsEnum(Role) role: Role;
}
