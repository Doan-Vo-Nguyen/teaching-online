import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({schema: "teaching"})
export class LanguageCode {
    @PrimaryColumn()
    id: number

    @Column({type: "varchar", length: 255})
    name: string
}
