import Koa ,{ Context, Next }from 'koa'
// 不会生成路由，会把生成的函数绑定到指定路由，提供了绑定路由方式，和类注册的方式。
import {bootstrapControllers, Params} from 'koa-ts-controllers'
import Router from 'koa-router'
import path from 'path';
import KoaBody from 'koa-body';
import KoaBodyparser from 'koa-bodyparser';

import configs from './configs/index';

import { Sequelize } from 'sequelize-typescript'
import jwt from 'jsonwebtoken';
// import KoaStaticCache from 'koa-static-cache';
import KoaStaticCache from 'koa-static-cache'

// 注册路由
(async ()=> {

    const app = new Koa();
    const router = new Router();
    
    // 静态资源代理
    app.use(KoaStaticCache({
        dir: configs.storage.dir,
        prefix: configs.storage.prefix,
        gzip: true,
        dynamic: true
    }))
    // 连接数据库
    const sequelize = new Sequelize({
        ...configs.database,
        models: [__dirname + '/models/**/*']
    })
    
    app.use(async (ctx: Context, next: Next)=> {
        let token = ctx.headers['authorization']
        if (token) {
            ctx.userInfo = jwt.verify(token,configs.jwt.privateKey) as UserInfo
        }
        await next()
    })

    await bootstrapControllers(app,{
        router,
        basePath:"/api",
        versions: {
            1: 'This version is deprecated and will soon be removed. Consider migrating to version 2 ASAP',
            2: true,
            dangote: true // great for custom, business client specific endpoint versions
        },
        controllers: [
                path.resolve(__dirname, './controllers/**/*')
        ],
        // 错误捕获与处理(统一处理)
        errorHandler: async (err:any ,context: any) =>{
            
            let status = 500
            let body: any = {
                statusCode : status,
                error: "server error",
                message: "An internal server error occurred."
            }
            // err存在output字段时，内部message可以自定义
            // 例：@IsNumberString(undefined,{message:"page必须是纯数字"})
            if (err.output) {
                status = err.output.statusCode
                body = {...err.output.payload}
                if (err.data) {
                    body.content = err.data
                }
            }
            context.status = status
            context.body = body
        }
    });

    // 处理路由不匹配
    // router.all('/*',async ctx => {
    //     throw Boom.notFound('该页面不存在')
    // })

    // app.use(KoaBodyparser());
    // app.use(router.routes());
    // app.use(router.allowedMethods());


    app.use(KoaBody({
        multipart: true,
        formidable: {
            uploadDir: configs.storage.dir,
            keepExtensions: true
        }
    }));
    app.use(router.routes());

    app.listen(configs.server.port, configs.server.host, () => {
        console.log(`服务已启动：http://${configs.server.host}:${configs.server.port}`);
    })
})()
