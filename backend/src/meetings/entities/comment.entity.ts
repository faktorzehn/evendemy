import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn, RelationId } from "typeorm";
import { MeetingEntity } from "./meeting.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { CommentDto } from "../dto/comment.dto";

@Entity("comment")
export class CommentEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @CreateDateColumn()
    creationDate: Date;

    @ManyToOne(() => UserEntity)
    @JoinColumn({name: "username"})
    _user: UserEntity;

    @Column()
    username: string;

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
            author: entity._user.username,
        };
    }
}