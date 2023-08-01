import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CommentDto } from "../dto/comment.dto";

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

    public static toDTO(entity: CommentEntity): CommentDto{
        if(!entity){
            return null;
        }

        return {
            text: entity.text,
            creationDate: entity.creationDate,
            author: entity.author
        }
    }
}
