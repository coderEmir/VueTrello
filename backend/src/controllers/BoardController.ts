import { Context } from 'koa';
import { Post, Delete, Get, Put, Ctx, Flow, Params, Body, Controller } from 'koa-ts-controllers'
import authorization from '../middlewares/authorization';
import { PostAddBoardBody, PutUpdateBoardBody ,findBoard} from '../validators/BoardValidationDecorators';
import { Board as BoardModel } from '../models/Board'
import Boom from '@hapi/boom';

@Controller("/board")
@Flow([authorization])
export class BoardController {
    // 创建新面板
    @Post('')
    async addBoard(
        @Ctx() ctx: Context,
        @Body() body: PostAddBoardBody,
    ) {
        let {name} = body
        console.log("name",name);
        
        let board = new BoardModel()
        board.name = name
        board.userId = ctx.userInfo?.userId as number
        console.log("userId",board.userId);
        console.log("name", name);
        await board.save()

        ctx.status = 200
        return board
    }
    // 获取所有面板
    @Get('/getBoards')
    async getBoards (
        @Ctx() ctx: Context,
    ) {
        let where = {
            userId: ctx.userInfo?.userId as number
        }
        let boards = await BoardModel.findAll({where})
        return boards
    }
    // 获取指定面板
    @Get('/:id(\\d+)') 
    async getBoard (
        @Ctx() ctx: Context,
        @Params('id') id: number 
    ) {
        // 根据PrimaryKey查询面板是否存在
        let board = await findBoard(id, ctx.userInfo?.userId as number)
        return board
    }
    // 更新面板
    @Put('/:id(\\d+)')
    async updateBoard (
        @Ctx() ctx: Context,
        @Params('id') id: number,
        @Body() body: PutUpdateBoardBody
    ) {
        // 根据PrimaryKey查询面板是否存在
        let board = await findBoard(id, ctx.userInfo?.userId as number)
        return board
    }
    // 删除面板
    @Delete('/:id(\\d+)')
    async deleteBoard(
        @Ctx() ctx: Context,
        @Params('id') id: number
    ) {
        let board = await findBoard(id, ctx.userInfo?.userId as number)
        // 删除数据方法=>destroy
        await board.destroy()
        ctx.status = 204
    }
}

