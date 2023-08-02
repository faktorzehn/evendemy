import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("meeting_user")
export class MeetingUserEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    mid: number;

    @Column()
    username: string;

    @Column({default: false})
    tookPart: boolean;

    @Column()
    dateOfRegistration: Date;

    @Column({nullable: true})
    dateOfConfirmation: Date;

    @Column('text', {default: [], array: true})
    externals: [string];

    @Column({default: false})
    deleted: boolean;
}
