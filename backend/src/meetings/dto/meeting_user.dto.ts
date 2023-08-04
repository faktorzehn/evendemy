export class MeetingUserDto {
    id: number;
    mid: number;
    username: string;
    tookPart: boolean;
    dateOfRegistration: Date;
    dateOfConfirmation: Date | null;
    externals: string[];
    deleted: boolean;
}