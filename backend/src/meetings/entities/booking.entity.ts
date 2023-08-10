import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { MeetingEntity } from "./meeting.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { BookingDto } from "../dto/booking.dto";

@Entity("booking")
export class BookingEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    mid: number;

    @ManyToOne(() => MeetingEntity, (meeting) => meeting.bookings)
    meeting: MeetingEntity;

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

    @ManyToOne(() => UserEntity, (user) => user.bookings)
    @JoinColumn({name: "username"})
    user: UserEntity;

    public static toDTO(entity: BookingEntity): BookingDto {
        if (!entity) {
            return null;
        }

        const dto = new (BookingDto);
        dto.mid = entity.mid;
        dto.username = entity.user.username;
        dto.tookPart = entity.tookPart;
        dto.dateOfRegistration = entity.dateOfRegistration;
        dto.dateOfConfirmation = entity.dateOfConfirmation;
        dto.externals = entity.externals;
        dto.firstname = entity.user.firstname;
        dto.lastname = entity.user.lastname;

        return dto;
    }
}
