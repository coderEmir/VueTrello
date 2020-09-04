import configs from './configs'
import Koa from 'koa'
// 不会生成路由，会把生成的函数绑定到指定路由，提供了绑定路由方式，和类注册的方式。
import {bootstrapControllers, Params} from 'koa-ts-controllers'
import Router from 'koa-router'
import path from 'path';
import KoaBodyparser from 'koa-bodyparser';
import { error } from 'console';

const app = new Koa();
const router = new Router();

// 注册路由
(async ()=> {
    
    await bootstrapControllers(app,{
        router,
        basePath:"/api",
        // versions:[1],
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

    app.use(KoaBodyparser());
    app.use(router.routes());
    app.use(router.allowedMethods());

    app.listen(configs.server.port, configs.server.host, () => {
        console.log(`服务已启动：http://${configs.server.host}:${configs.server.port}`);
    })
})()
