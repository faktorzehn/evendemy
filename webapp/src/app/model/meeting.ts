import { Comment } from './comment';

export type VALIDITY_PERIODE = '1_WEEK' | '2_WEEKS';
export class Meeting {
  public title: string;
  public shortDescription: string;
  public description: string;
  public costCenter: string;
  public courseOrEvent: 'course' | 'event' = 'event';
  public isIdea: boolean;
  public isFreetime: boolean;
  public startTime: Date;
  public endTime: Date;
  public location: String;
  public creationDate: Date;
  public lastUpdateDate: Date;
  public mid: number;
  public username: string;
  public numberOfAllowedExternals: number;
  public comments: Comment[];
  public tags: String[];
  public images: String[];
  public validityPeriode?: VALIDITY_PERIODE;
  public static sortByDate = (a: Meeting, b: Meeting) => {
    const dateA = a.startTime ? new Date(a.startTime).getTime() : 0;
    const dateB = b.startTime ? new Date(b.startTime).getTime() : 0;
    return dateA - dateB;
  }
  constructor() {  }
}
