import { Context, Next } from 'koa';
import Boom from '@hapi/boom';

export default async function authorization (
    ctx: Context,
    next: Next
) {
    if (!ctx.userInfo || ctx.userInfo.userId < 1) {
        throw Boom.unauthorized("授权失败,请先登录")
    }
    await next()
}