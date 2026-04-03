
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "../common/entities/base.entity";
import { OtpType} from "@/core/enums";
import { User } from "../users/user.entity";

@Entity("otp_codes")
export class OtpCode extends BaseEntity {
  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "user_id" })
  userId: number;

  @ApiProperty()
  @Column({ length: 6 })
  code: string;

  @ApiProperty()
  @Column({ name: "expired_at" })
  expiredAt: Date;

  @ApiProperty({ enum: OtpType })
  @Column({ type: "enum", enum: OtpType })
  type: OtpType;

  @ApiProperty()
  @Column({ name: "is_used", default: false })
  isUsed: boolean;
}
