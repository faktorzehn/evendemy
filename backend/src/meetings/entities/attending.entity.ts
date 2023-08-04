import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, OneToMany, ManyToOne, OneToOne } from "typeorm";
import { MeetingEntity } from "./meeting.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { MeetingUserDto } from "../dto/meeting_user.dto";

@Entity("meeting_user")
export class AttendingEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    mid: number;

    @ManyToOne(() => MeetingEntity, (meeting) => meeting.attendees)
    attendee: MeetingEntity;

    @Column()
    username: string;

    @ManyToOne(() => UserEntity, (user) => user.unames)
    uname: UserEntity;

    @Column({default: false})
    tookPart: boolean;

    @CreateDateColumn()
    dateOfRegistration: Date;

    @Column({nullable: true})
    dateOfConfirmation: Date;

    @Column('text', {default: [], array: true})
    externals: [string];

    @Column({default: false})
    deleted: boolean;

    public static toDTO(entity: AttendingEntity): MeetingUserDto {
        if (!entity) {
            return null;
        }

        const dto = new MeetingUserDto();
        dto.id = entity.id;
        dto.mid = entity.mid;
        dto.username = entity.username;
        dto.tookPart = entity.tookPart;
        dto.dateOfRegistration = entity.dateOfRegistration;
        dto.dateOfConfirmation = entity.dateOfConfirmation;
        dto.externals = entity.externals;
        dto.deleted = entity.deleted;

        return dto;
    }
}
