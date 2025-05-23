import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
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

    @Column({type: "text", nullable: true})
    content: string

    @CreateDateColumn()
    created_at: Date

    @CreateDateColumn()
    updated_at: Date

    @ManyToOne(() => Users, users => users.notifications, {onDelete: 'CASCADE'})
    @JoinColumn({name: "teacher_id"})
    teacher?: Relation<Users>
    
    @ManyToOne(() => Classes, classes => classes.notifications, {onDelete: 'CASCADE'})
    @JoinColumn({name: "class_id"})
    class?: Relation<Classes>
}