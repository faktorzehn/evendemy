export class BookingDto {
    mid: number;
    username: string;
    firstname: string;
    lastname: string;
    tookPart: boolean;
    dateOfRegistration: Date;
    dateOfConfirmation: Date | null;
    externals: string[];
}