import {
    Controller,
    Ctx,
    Post,
    Get,
    Put,
    Delete,
    Flow,
    Params,
    Query,
    Body
} from "koa-ts-controllers";
import authorization from "../middlewares/authorization";
import { Context } from 'koa';
import {
    GetCardsQuery,
    PostAddCardBody,
    PutUpdateCardBody,
    getAndValidateBoardListCard,
    getAndValidateCardAttachment
} from '../validators/BoardListCard';
import {
    getAndValidateBoardList
} from '../validators/BoardListValidationDecorators'
import { BoardListCard as BoardListCardModel } from '../models/BoardListCard';
import { Comment as CommentModel } from '../models/Comment';
import { CardAttachment as CardAttachmentModel } from '../models/CardAttachment';
import { Attachment as AttachmentModel } from '../models/Attachment';
import configs from '../configs';
import Boom from '@hapi/boom';


@Controller('/card')
@Flow([authorization])
export class BoardListCardController {

    /**
     * 创建新卡片
     */
    @Post('')
    public async addCard(
        @Ctx() ctx: Context,
        @Body() body: PostAddCardBody
    ) {
        let { boardListId, name, description } = body;

        await getAndValidateBoardList(boardListId, ctx.userInfo?.userId);

        let boarListCard = new BoardListCardModel();
        boarListCard.userId = ctx.userInfo.userId;
        boarListCard.boardListId = boardListId;
        boarListCard.name = name;
        boarListCard.description = description || '';

        await boarListCard.save();

        ctx.status = 201;
        return boarListCard;
    }

    /**
     * 获取卡片列表
     */
    @Get('')
    public async getCards(
        @Ctx() ctx: Context,
        @Query() query: GetCardsQuery
    ) {
        let { boardListId } = query;

        await getAndValidateBoardList(boardListId, ctx.userInfo.userId);

        let boardListCards = await BoardListCardModel.findAll({
            where: {
                boardListId
            },
            order: [['id', 'asc']],
            include: [
                {
                    model: CommentModel,
                    attributes: ['id']
                },
                {
                    model: CardAttachmentModel,
                    include: [
                        {
                            model: AttachmentModel
                        }
                    ]
                }
            ]
        });

        let boardListCardsData = boardListCards.map((card: BoardListCardModel) => {
            // 处理附件的路径和封面
            let coverPath = '';
            let attachments = card.attachments.map(attachment => {
                let data = attachment.toJSON() as CardAttachmentModel & { path: string };
                data.path = configs.storage.prefix + '/' + data.detail.name;

                if (data.isCover) {
                    coverPath = data.path;
                }

                return data;
            });

            return {
                id: card.id,
                userId: card.userId,
                boardListId: card.boardListId,
                name: card.name,
                description: card.description,
                order: card.order,
                createdAt: card.createdAt,
                updatedAt: card.updatedAt,
                attachments: attachments,
                coverPath: coverPath,
                commentCount: card.comments.length
            }
        });

        return boardListCardsData;
    }

    /**
     * 获取一个卡片信息
     */
    @Get('/:id(\\d+)')
    public async getCard(
        @Ctx() ctx: Context,
        @Params('id') id: number
    ) {
        let boardListCard = await getAndValidateBoardListCard(id, ctx.userInfo.userId);

        return boardListCard;
    }

    /**
     * 更新一个卡片信息
     */
    @Put('/:id(\\d+)')
    public async putCard(
        @Ctx() ctx: Context,
        @Params('id') id: number,
        @Body() body: PutUpdateCardBody
    ) {
        let { boardListId, name, description, order } = body;

        let boardListCard = await getAndValidateBoardListCard(id, ctx.userInfo.userId);

        boardListCard.boardListId = boardListId || boardListCard.boardListId;
        boardListCard.name = name || boardListCard.name;
        boardListCard.description = description || boardListCard.description;
        boardListCard.order = order || boardListCard.order;

        await boardListCard.save();

        ctx.status = 204;
        return;
    }

    /**
     * 删除一个卡片信息
     */
    @Delete('/:id(\\d+)')
    public async deleteCard(
        @Ctx() ctx: Context,
        @Params('id') id: number
    ) {
        let boardListCard = await getAndValidateBoardListCard(id, ctx.userInfo.userId);

        await boardListCard.destroy();

        ctx.status = 204;
        return;
    }

    /**
     * 附件上传
     */
    @Post('/attachment')
    public async addAttachemnt(
        @Ctx() ctx: Context,
        @Body() body: any
    ) {
        
        let { boardListCardId} = body;
        // console.log("ctx=====", ctx.request);
        // console.log("ctx=====", ctx.res);
        if (!ctx.request.files || !ctx.request.files.attachment) {
            throw Boom.badData('缺少附件');
        }

        let file = ctx.request.files.attachment;
        console.log("file====", ctx.request.files);
        console.log("boardListCardId====", boardListCardId);
        
        let attachment = new AttachmentModel();
        attachment.userId = ctx.userInfo.userId;
        attachment.originName = file.name;
        attachment.name = file.path.split('/').pop() as string;
        attachment.type = file.type;
        attachment.size = file.size;
        console.log(attachment);
        
        await attachment.save();

        let cardAttachment = new CardAttachmentModel();
        cardAttachment.userId = ctx.userInfo.userId;
        cardAttachment.boardListCardId = boardListCardId;
        cardAttachment.attachmentId = attachment.id;
        await cardAttachment.save();

        ctx.status = 201;
        return {
            id: cardAttachment.id,
            userId: cardAttachment.userId,
            boardListCardId: cardAttachment.boardListCardId,
            attachmentId: attachment.id,
            path: configs.storage.prefix + '/' + attachment.name,
            isCover: false,
            detail: attachment
        }

    }

    /**
     * 删除附件
     */
    @Delete('/attachment/:id(\\d+)')
    public async deleteAttachment(
        @Ctx() ctx: Context,
        @Params('id') id: number
    ) {
        let cardAttachment = await getAndValidateCardAttachment(id, ctx.userInfo.userId);

        // 这里只是移除了关联表，附件表，硬盘里存储的附件是没有删除
        await cardAttachment.destroy();
        ctx.status = 204;
        return;
    }

    /**
     * 设置封面
     */
    @Put('/attachment/cover/:id(\\d+)')
    public async setCover(
        @Ctx() ctx: Context,
        @Params('id') id: number
    ) {

        let cardAttachment = await getAndValidateCardAttachment(id, ctx.userInfo.userId);

        await CardAttachmentModel.update({
            isCover: false
        }, {
            where: {
                boardListCardId: cardAttachment.boardListCardId
            }
        });

        cardAttachment.isCover = true;
        await cardAttachment.save();

        ctx.status = 204;
        return;

    }

    /**
     * 取消封面
     */
    @Delete('/attachment/cover/:id(\\d+)')
    public async deleteCover(
        @Ctx() ctx: Context,
        @Params('id') id: number
    ) {

        let cardAttachment = await getAndValidateCardAttachment(id, ctx.userInfo.userId);

        cardAttachment.isCover = false;
        cardAttachment.save();

        ctx.status = 204;
        return;
    }
}