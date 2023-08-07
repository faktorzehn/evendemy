import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn, RelationId } from "typeorm";
import { MeetingEntity } from "./meeting.entity";
import { UserEntity } from "src/users/entities/user.entity";

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
    meeting: MeetingEntity;
}
