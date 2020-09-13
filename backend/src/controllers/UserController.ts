import { Controller, Post, Body, Ctx } from 'koa-ts-controllers'

import { RegisterBody, LoginBody } from '../validators/User'
import { Context } from 'koa';

// 一个模型类对应一张表，new出的对象代表表中的一条数据
import { User as UserModel } from '../models/User'

import Boom from '@hapi/boom'
import crypto from 'crypto'

import jwt from 'jsonwebtoken'
import configs from '../configs';

@Controller("/user")
export class UserController {
    // 登录
    @Post("/login")
    async login(
        @Ctx() ctx : Context,
        @Body() body: LoginBody
    ) {
        // 获取name和password，数据库存校验
        let { name, password } = body
        
        let md5 = crypto.createHash('md5')
        let md5Pwd = md5.update(password).digest('hex')

        let userModel = await UserModel.findOne({
            // where: { name, password: newPwd }
            where: {name}
        })
        if (!userModel) {
            throw Boom.notFound("用户不存在")
        }
        if (userModel.password !== md5Pwd) {
            throw Boom.forbidden("密码错误")
        }

        let userInfo = {
            userId: userModel.id,
            name: userModel.name
        }

        let token = jwt.sign(userInfo, configs.jwt.privateKey)

        ctx.status = 200
        ctx.set('authorization',token)

        return {
            msg: `登录成功`,
            data: userInfo
        }
    }
    
    // 注册
    @Post("/register")
    async register(
        @Ctx() ctx: Context,
        @Body() body: RegisterBody
        
    ) {
        // 获取name和password
        let {name, password} = body
        
        // 操作表，用类的静态方法
        // 执行select，数据库异步操作，需要await
        let userModel = await UserModel.findOne({
            where: { name }
        })
        // 判断数据库中是否存在要注册的用户
        if (userModel) {
            // 存在，向前端抛出失败信息
            throw Boom.conflict("注册失败，用户名已被注册")
        }

        // 操作数据，用对象方法
        let newUser = new UserModel()
        newUser.name = name
        newUser.password = password
        await newUser.save()
        
        ctx.status = 200
        
        // 返回给前端成功的response
        return {
            msg: `您已注册成功，注册时间：${newUser.createdAt}`,
            data: {
                userId: newUser.id,
                username: newUser.name
            }
        }
    }


}