import {IsNumber, IsNumberString, MaxLength, ValidateIf} from "class-validator";


export class PostAddCommentBody {

    @IsNumber(undefined, {
        message: 'boardListCardId必须为数字'
    })
    boardListCardId: number;

    @MaxLength(2000, {
        message: '评论内容不能大于2000个字符'
    })
    content: string;

}

export class GetCommentsQuery {

    @IsNumberString( undefined, {
        message: 'boardListCardId必须为数字'
    })
    boardListCardId: number;

    @ValidateIf(o=>o.page !== undefined)
    @IsNumberString(undefined, {
        message: '分页必须是数字'
    })
    page?: number;

}