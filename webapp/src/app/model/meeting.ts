import {Comment} from './comment';

export class Meeting {
  public title: string;
  public shortDescription: string;
  public description: string;
  public costCenter: string;
  public courseOrEvent: string;
  public isIdea: boolean;
  public isFreetime: boolean;
  public date: Date;
  public startTime: String;
  public endTime: String;
  public location: String;
  public creationDate: Date;
  public mid: number;
  public username: string;
  public numberOfAllowedExternals: number;
  public comments: Comment[];
  public tags: String[];
  public static sortByDate = (a: Meeting, b: Meeting) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateA - dateB;
  }
  constructor() {  }
}
