import { UpdateCommentDto } from "./update-comment.dto";

export class CommentDto extends UpdateCommentDto{
    creationDate: Date;
    author: string;
}