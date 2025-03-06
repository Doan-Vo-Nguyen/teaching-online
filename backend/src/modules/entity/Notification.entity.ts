import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Users } from "./User.entity";
import { Classes } from "./Classes.entity";

@Entity({schema: "teaching"})
export class Notification {
    @PrimaryGeneratedColumn()
    notification_id: number
    
    @Column()
    class_id: number

    @Column()
    teacher_id: number

    @Column({type: "varchar", length: 500})
    title: string

    @Column({type: "text"})
    content: string

    @ManyToOne(() => Users, users => users.notifications, {onDelete: 'NO ACTION'})
    @JoinColumn({name: "teacher_id"})
    teacher?: Relation<Users>
    
    @ManyToOne(() => Classes, classes => classes.notifications, {onDelete: 'NO ACTION'})
    @JoinColumn({name: "class_id"})
    class?: Relation<Classes>
}