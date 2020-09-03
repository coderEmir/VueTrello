import { Controller, Params, Query, Post, Body, Header } from "koa-ts-controllers";

import {Get} from 'koa-ts-controllers'

// 页面根路由
@Controller("/test")
class TestControllers {
    
    @Get("/hello")
    async hello() {
        return "hello"
    }
    
    // 获取动态路由参数 parmas
    // @Get("/user/:name") 
    // // 方式一：
    // async getUser(
    //     @Params('name') name : String) {
        
    //     return `当前登录的用户:${name}`
    // }
    // 方式二：
    // async getUser(@Params() parma: {name: String}) {
        
    //     return `当前登录的用户:${parma.name}`
    // }


    // 获取查询参 query
    // @Get('/book')
    // async getBook(@Query("name") name: String)
    // {
    //     return `要查询的书籍名称是：${name}`
    // }


    //  获取body header信息
    // 需要body解析库，比如：koa-bodyparser（-D @types/koa-bodyparser）
    @Post('/login')
    async login(
        @Body() body: {
            name: String
            password: String
        },
        @Header() header: any
    ) {
        console.log(body);
        console.log("header",header);
        return `当前提交的数据：${JSON.stringify(body)},请求头信息：${header}`
    }
}