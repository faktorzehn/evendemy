import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { MeetingEntity } from "./meeting.entity";

@Entity("comment")
export class CommentEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @CreateDateColumn()
    creationDate: Date;

    @Column()
    author: string;

    @ManyToOne(() => MeetingEntity, (meeting) => meeting.comments)
    meeting: MeetingEntity;
}
