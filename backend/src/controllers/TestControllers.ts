import { Controller } from "koa-ts-controllers";

import {
    Get} from 'koa-ts-controllers'
@Controller("/")
class TestControllers {
    @Get("/hello")
    async hello() {
        return "hello"
    }
}