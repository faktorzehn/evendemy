import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, OneToMany, ManyToOne, OneToOne } from "typeorm";
import { MeetingEntity } from "./meeting.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { AttendingDto } from "../dto/attending.dto";

@Entity("attending")
export class AttendingEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    mid: number;

    @ManyToOne(() => MeetingEntity, (meeting) => meeting.attendees)
    meeting: MeetingEntity;

    @Column()
    username: string;

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

    @ManyToOne(() => UserEntity, (user) => user.meetings)
    user: UserEntity;

    public static toDTO(entity: AttendingEntity): AttendingDto {
        if (!entity) {
            return null;
        }

        const dto = new (AttendingDto);
        dto.mid = entity.mid;
        dto.username = entity.username;
        dto.tookPart = entity.tookPart;
        dto.dateOfRegistration = entity.dateOfRegistration;
        dto.dateOfConfirmation = entity.dateOfConfirmation;
        dto.externals = entity.externals;
        dto.firstname = entity.user.firstname;
        dto.lastname = entity.user.lastname;

        return dto;
    }
}
