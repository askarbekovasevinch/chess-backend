
import { Entity, Column } from "typeorm";
import { Exclude } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from ".././common/entities/base.entity";
import { Role, LoginType} from "@/core/enums";

@Entity("users")
export class User extends BaseEntity {
  @ApiProperty({ enum: Role })
  @Column({ type: "enum", enum: Role, default: Role.USER })
  role: Role;

  @ApiProperty()
  @Column({ name: "full_name", length: 64 })
  fullName: string;

  @ApiProperty({ nullable: true })
  @Column({ name: "profile_image", length: 128, nullable: true })
  profileImage: string;

  @ApiProperty()
  @Column({ length: 64, unique: true })
  login: string;

  @ApiProperty({ enum: LoginType })
  @Column({ name: "login_type", type: "enum", enum: LoginType })
  loginType: LoginType;

  @Exclude()
  @Column({ length: 128, nullable: true })
  password: string;

  @ApiProperty({ nullable: true })
  @Column({ name: "birth_date", type: "date", nullable: true })
  birthDate: Date;

  @ApiProperty()
  @Column({ name: "is_verified", default: false })
  isVerified: boolean;

  @ApiProperty()
  @Column({ name: "is_active", default: true })
  isActive: boolean;

  @Exclude()
  @Column({ name: "refresh_token", nullable: true })
  refreshToken: string;
}
