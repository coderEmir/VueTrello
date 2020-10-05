import { IsNotEmpty, IsNumber, IsNumberString, Min, ValidateIf } from "class-validator"
import { BoardList as BoardListModel } from "../models/BoardList";
import Boom from '@hapi/boom';
export class PostAddBoardListBody {
    @ValidateIf(o=>o.boardId!==undefined)
    @Min(1,{
        message: "必须是数字"
    })
    boardListId: number
    
    name: string
}

export class GetBoardListsQuery {

    @IsNumberString(undefined, {
        message: "必须是数字"
    })
    
    boardListId: number
}

export class PutUpdateBoardListBody {

    @ValidateIf(o => o.boardListId !== undefined)
    @Min(1, {
        message: "必须是数字"
    })
    boardListId: number

    @ValidateIf(o => o.name !== undefined)
    @IsNotEmpty({
        message: "列表名称不能为空"
    })
    name: string

    @ValidateIf(o => o.order !== undefined)
    @IsNumber(undefined,{
        message: "序列号不能为空"
    })
    order:number
}

export async function getAndValidateBoardList(id: number, userId: number): Promise<BoardListModel> {
 
    let board = await BoardListModel.findByPk(id)
    if (!board) {
        throw Boom.notFound('指定列表不存在');
    }

    if (board.dataValues.userId !== userId) {
        throw Boom.forbidden('无访问该列表详情的权限');
    }
    return board;
}

