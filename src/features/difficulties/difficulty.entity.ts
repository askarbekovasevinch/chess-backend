import {Entity, Column} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {BaseEntity} from "../common/entities/base.entity";

@Entity("difficulties")
export class Difficulty extends BaseEntity {
    @ApiProperty()
    @Column({length: 32, unique: true})
    title: string;

    @ApiProperty()
    @Column({length: 128})
    icon: string;
}
