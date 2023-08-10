import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn, RelationId } from "typeorm";
import { MeetingEntity } from "./meeting.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { CommentDto } from "../dto/comment.dto";
import { UpdateCommentDto } from "../dto/update-comment.dto";

@Entity("comment")
export class CommentEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @CreateDateColumn()
    creationDate: Date;

    @ManyToOne(() => UserEntity, {eager: true})
    @JoinColumn({name: "username"})
    user: UserEntity;

    @ManyToOne(() => MeetingEntity, (meeting) => meeting.comments)
    @JoinColumn({name: "mid"})
    meeting: MeetingEntity;

    public static toDTO(entity: CommentEntity): CommentDto {
        if (!entity) {
            return null;
        }
        return {
            text: entity.text,
            creationDate: entity.creationDate,
            author: entity.user.username,
        };
    }
}
