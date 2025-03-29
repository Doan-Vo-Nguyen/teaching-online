import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Users } from "./User.entity";

@Entity({schema: "teaching_online"})
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    user_id: number

    @Column({type: "varchar", length: 255})
    token: string

    @Column({type: "datetime"})
    expires_at: Date

    @Column({default: false})
    is_revoked: boolean

    @ManyToOne(() => Users, user => user.refreshTokens, {onDelete: "CASCADE"})
    @JoinColumn({name: "user_id"})
    user?: Relation<Users>
}
