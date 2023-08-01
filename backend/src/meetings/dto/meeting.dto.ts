import { MeetingEntity } from "../entities/meeting.entity";
import { CommentDto } from "./comment.dto";
import { UpdateMeetingDto } from "./update-meeting.dto";

export class MeetingDto extends UpdateMeetingDto{
    creationDate: Date;
    lastUpdateDate: Date;
    username: string;
    comments: CommentDto[];
    tags: string[];
    images: string[];
}
