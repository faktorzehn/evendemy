import { SettingsEntity } from "src/users/entities/setting.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("user")
export class UserEntity {
    @PrimaryColumn()
    username: string;
  
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
    settings: SettingsEntity
}
