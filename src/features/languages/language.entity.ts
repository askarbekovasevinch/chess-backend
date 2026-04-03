import {Entity, Column} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {BaseEntity} from "../common/entities/base.entity";

@Entity("languages")
export class Language extends BaseEntity {
    @ApiProperty()
    @Column({length: 32, unique: true})
    title: string;

    @ApiProperty()
    @Column({length: 2, unique: true})
    code: string;
}
