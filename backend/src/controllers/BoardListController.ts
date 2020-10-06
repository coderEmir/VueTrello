import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Params,
    Query,
    Body,
    Flow,
    Ctx
} from 'koa-ts-controllers';
import authorization from "../middlewares/authorization";
import { Context } from 'koa';
import {
    PostAddBoardListBody,
    GetBoardListsQuery,
    PutUpdateBoardListBody,
    getAndValidateBoardList

} from '../validators/BoardListValidationDecorators';
import { findBoard } from '../validators/BoardValidationDecorators';
import { BoardList as BoardListModel } from "../models/BoardList";


@Controller('/list')
@Flow([authorization])
export class BoardListController {

    /*
    * 创建列表
    * */
    @Post('')
    public async addList(
        @Ctx() ctx: Context,
        @Body() body: PostAddBoardListBody
    ) {
        let { boardListId, name } = body;
        console.log("body", body);
        
        await findBoard(boardListId, ctx.userInfo.userId);
        
        let maxOrderBoardList = await BoardListModel.findOne({
            where: {
                boardListId
            },
            order: [['order', 'desc']]
        });
        let boardList = new BoardListModel();
        boardList.userId = ctx.userInfo.userId;
        boardList.boardListId = boardListId;
        boardList.name = name;
        boardList.order = maxOrderBoardList ? maxOrderBoardList.order + 65535 : 65535;
        await boardList.save();

        ctx.status = 201;
        return boardList;
    }

    /**
     * 获取当前用户指定的面板下的所有列表集合
     */
    @Get('')
    public async getLists(
        @Ctx() ctx: Context,
        @Query() query: GetBoardListsQuery
    ) {
        let { boardListId } = query;
        
        // await getAndValidateBoardList(boardId, ctx.userInfo.userId);
        let boardList = await BoardListModel.findAll({
            where: {
                boardListId
            },
            order: [['order', 'asc']]
        });
        return boardList;
    }

    /**
     * 获取指定列表详情
     */
    @Get('/:id(\\d+)')
    public async getList(
        @Ctx() ctx: Context,
        @Params('id') id: number
    ) {
        let boardList = await getAndValidateBoardList(id, ctx.userInfo.userId);

        return boardList;
    }

    /**
     * 更新
     */
    @Put('/:id(\\d+)')
    public async updateList(
        @Ctx() ctx: Context,
        @Params('id') id: number,
        @Body() body: PutUpdateBoardListBody
    ) {
        let { boardListId, order } = body;
        console.log(body);
        
        let boardList = await getAndValidateBoardList(id, ctx.userInfo.userId);
        console.log("boardList",boardList);
        
        boardList.boardListId = boardListId || boardList.boardListId;
        boardList.order = order || boardList.order;

        await boardList.save();
        ctx.status = 204;
        return;
    }

    /**
     * 删除
     */
    @Delete('/:id(\\d+)')
    public async deleteList(
        @Ctx() ctx: Context,
        @Params('id') id: number
    ) {
        console.log("Delete");
        
        let boardList = await getAndValidateBoardList(id, ctx.userInfo.userId);

        boardList.destroy();
        ctx.status = 204;
        return;

    }


}