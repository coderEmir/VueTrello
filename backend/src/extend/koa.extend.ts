
import  Koa from 'koa';

declare module 'koa' {

    interface Context {
        userInfo ?: UserInfo
    }
}