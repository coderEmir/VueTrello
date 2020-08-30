import configs from './configs'
import Koa from 'koa'
// 不会生成路由，会把生成的函数绑定到指定路由，提供了绑定路由方式，和类注册的方式。
import {bootstrapControllers, Params} from 'koa-ts-controllers'
import Router from 'koa-router'
import path from 'path';

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
            path.resolve(__dirname, '/controllers/**/*')
            ],
    });

    app.use(router.routes());

    app.listen(configs.server.port, configs.server.host, () => {
        console.log(`服务已启动：http://${configs.server.host}:${configs.server.port}`);
    })
})()
