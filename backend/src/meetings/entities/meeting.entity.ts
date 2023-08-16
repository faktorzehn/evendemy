import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CommentEntity } from "./comment.entity";
import { MeetingDto } from "../dto/meeting.dto";
import { BookingEntity} from "./booking.entity";

export type VALIDITY_PERIODE = '1_WEEK' | '2_WEEKS';
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

    @Column({nullable: true})
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

    @Column({nullable: true})
    validityPeriode?: VALIDITY_PERIODE;

    @OneToMany(() => CommentEntity, (comment) => comment.meeting, { cascade: true})
    comments: CommentEntity[];

    @OneToMany(() => BookingEntity, (booking) => booking.user, {cascade: true})
    bookings: BookingEntity[];

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
            creationDate: entity.creationDate,
            lastUpdateDate: entity.lastUpdateDate,
            username: entity.username,
            comments: entity.comments ? entity.comments.map(CommentEntity.toDTO) : [],
            tags: entity.tags,
            images: entity.images,
            validityPeriode: entity.validityPeriode
        }
    }
}
