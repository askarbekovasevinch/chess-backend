import {Entity, Column} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {BaseEntity} from "../common/entities/base.entity";

@Entity("authors")
export class Author extends BaseEntity {
    @ApiProperty()
    @Column({name: "full_name", length: 64})
    fullName: string;
}
