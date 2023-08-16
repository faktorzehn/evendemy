export class UpdateMeetingDto {
    mid: number;
    title: string;
    shortDescription:  string;
    description:  string;
    startTime?: Date;
    endTime?: Date;
    costCenter: string;
    location: string;
    courseOrEvent: 'course'|'event';
    isIdea:  boolean;
    isFreetime: boolean;
    numberOfAllowedExternals: number;
    validityPeriode?: '1_WEEK' | '2_WEEKS';
}
