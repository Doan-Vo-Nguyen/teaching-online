import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({schema: "teaching"})
export class TestCase {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type: "varchar", length: 255})
    input: string;

    @Column({type: "varchar", length: 255})
    output: string;
    
    
}