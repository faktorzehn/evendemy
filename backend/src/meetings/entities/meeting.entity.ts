import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CommentEntity } from "./comment.entity";
import { MeetingDto } from "../dto/meeting.dto";

@Entity("meeting")
export class MeetingEntity {

    @PrimaryGeneratedColumn()
    mid: number;

    @Column()
    title: string;

    @Column()
    shortDescription:  string;

    @Column()
    description:  string;

    @Column({nullable: true})
    startTime?: Date;

    @Column({nullable: true})
    endTime?: Date;

    @Column()
    costCenter: string;

    @Column()
    location: string;

    @Column()
    courseOrEvent: 'course'|'event';

    @Column()
    isIdea:  boolean;

    @Column()
    isFreetime: boolean;

    @CreateDateColumn()
    creationDate: Date;

    @UpdateDateColumn()
    lastUpdateDate: Date;

    @Column()
    username: string;

    @OneToMany(() => CommentEntity, (comment) => comment.id)
    comments: CommentEntity[];

    @Column()
    numberOfAllowedExternals: number;

    @Column("text",{array: true})
    tags: string[];

    @Column({default: false})
    deleted: boolean;

    @Column("text", {array: true})
    images: string[];

    public static toDTO(entity: MeetingEntity): MeetingDto{
        if(!entity){
            return null;
        }
        return {
            // update-meeting.dto
            mid: +entity.mid,
            title: entity.title,
            shortDescription:  entity.shortDescription,
            description:  entity.description,
            startTime: entity.startTime,
            endTime: entity.endTime,
            costCenter: entity.costCenter,
            location: entity.location,
            courseOrEvent: entity.courseOrEvent,
            isIdea:  entity.isIdea,
            isFreetime: entity.isFreetime,
            numberOfAllowedExternals: entity.numberOfAllowedExternals,

            // meeting.dto
            creationDate: entity.creationDate,
            lastUpdateDate: entity.lastUpdateDate,
            username: entity.username,
            comments: [],
            tags: entity.tags,
            deleted: entity.deleted,
            images: entity.images
        } as MeetingDto
    }
}
