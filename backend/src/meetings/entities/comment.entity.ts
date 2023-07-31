import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("comment")
export class CommentEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @Column()
    creationDate: Date;

    @Column()
    author: string;
}
