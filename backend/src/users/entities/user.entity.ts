import { AttendingEntity } from "src/meetings/entities/attending.entity";
import { SettingsEntity } from "src/users/entities/setting.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn} from "typeorm";

@Entity("user")
export class UserEntity {
    @PrimaryColumn()
    username: string;

    @ManyToOne(() => AttendingEntity, (user) => user.username)
    unames: AttendingEntity;
  
    @Column()
    firstname: string;
  
    @Column()
    lastname: string;

    @Column()
    email: string;
  
    @Column({ default: false })
    deleted: boolean;

    @Column({ default: false })
    avatar: boolean;

    @Column({ nullable: true})
    jobTitle?: string;

    @Column({ nullable: true })
    description?: string;

    @OneToOne(() => SettingsEntity, { cascade: ["remove"]})
    @JoinColumn()
    settings: SettingsEntity;

    public static toDTO(entity: UserEntity): UserDto{
        if(!entity){
            return null;
        }

        return {
            username: entity.username,
            firstname: entity.firstname,
            lastname: entity.lastname,
            email: entity.email,
            avatar: entity.avatar,
            jobTitle: entity.jobTitle,
            description: entity.description
        }
    }
}
