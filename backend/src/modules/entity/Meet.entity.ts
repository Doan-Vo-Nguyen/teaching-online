
import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation} from "typeorm";
import { Classes } from "./Classes.entity";

@Entity({schema: "teaching"})
export class Meet {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "int"})
    class_id: number

    @Column({type: "varchar", length: 255})
    room_name: string

    @Column({type: "varchar", length: 255})
    room_url: string

    @ManyToOne(() => Classes, cls => cls.meets, { onDelete: 'CASCADE' }) // Relation with Classes n-1
    @JoinColumn({name: "class_id"})
    class: Relation<Classes>
}