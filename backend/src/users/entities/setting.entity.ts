import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("settings")
export class SettingsEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    summaryOfMeetingsVisible: Boolean

}
