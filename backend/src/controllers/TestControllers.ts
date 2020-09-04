import { Controller, Params, Query, Post, Body, Header, Get } from "koa-ts-controllers";
import {IsNumberString} from 'class-validator'

class getNewsQuery {
    
    @IsNumberString()
    page: number
}


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

    // 路由parmas合法性 
    // 正则检验是否为数字
    // @Get("/userId/:id(\\d+)")
    // async getUserId(
    //     @Params('id') id : number 
    // ) {
    //     return '当前用户的ID是：'+ id
    // }

    // query、body合法性
    // 安装 class-validator（安装koa-ts-controllers时必须安装的库） 统一处理
    // 通过类来定义要验证的数据
    @Get("/news")
    async getNews (
        @Query() q : getNewsQuery
    ) {
         
    }
}

// 请求响应
// 响应码
// 成功响应200、201
// 失败响应  
// 服务器错误 500 => 请求参数错误等
// 业务逻辑错误 422、401、403 => 用户无权限等
// 请求路由不存在 404 => 断网或请求路由不存在
