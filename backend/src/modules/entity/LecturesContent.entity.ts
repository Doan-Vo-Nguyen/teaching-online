import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { Lectures} from "./Lectures.entity";
import { LectureType } from "../constant/index";

@Entity({ schema: "teaching" })
export class LecturesContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lecture_id: number;

  @Column({ type: "text", nullable: true })
  content: string;

  @Column({ type: "enum", enum: LectureType, nullable: true })
  type: LectureType;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Lectures, (lectures) => lectures.lecturesFiles, {
    onDelete: "NO ACTION",
  }) // Relation with Lectures n-1
  @JoinColumn({ name: "lecture_id" }) // Column name in the database
  lecture?: Relation<Lectures>;
}
