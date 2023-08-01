import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SettingsDto } from "../dto/settings.dto";

@Entity("settings")
export class SettingsEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    summaryOfMeetingsVisible: Boolean

    public static toDTO(entity: SettingsEntity): SettingsDto{
        if(!entity){
            return null;
        }

        return {
            summary_of_meetings_visible: entity.summaryOfMeetingsVisible
        }
    }

}
