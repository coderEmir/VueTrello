import { IsNotEmpty, MaxLength, ValidateIf } from "class-validator";
import { Board as BoardModel } from "../models/Board";
import Boom from "@hapi/boom";
export class PostAddBoardBody {
    @IsNotEmpty({
            message: "面板名称不能为空"
    })
    @MaxLength(255,{
        message: "名称最多255个字符"
    })
    name: string
}

export class PutUpdateBoardBody {
    
    @ValidateIf(o=>o.name !== undefined)
    @MaxLength(255, {
        message: "名称最多255个字符"
    })
    name: string
}

export async function findBoard(id: number, userId: number): Promise<BoardModel> {
    let board = await BoardModel.findByPk(id)
    if (!board) {
        throw Boom.notFound("不存在改面板")
    }
    if (board.userId !== userId) {
        throw Boom.forbidden("无访问该面板的权限")
    }
    return board
}