import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'
export function IsSameValue (property: any , validationOptions?: ValidationOptions) {
    // 返回一个处理完成的新函数
    return function (target: Object,propertyName: string) {
        // 利用class-validator，注册新的装饰器
        registerDecorator({
            // 必填参数全部赋值后，才不会报错
            target: target.constructor,
            propertyName,
            name: "IsSameValue",
            options: validationOptions,
            constraints: [property],
            validator: {
                validate(value:any, validationArguments?: ValidationArguments) : Promise<boolean> | boolean {
                    // 取出正在验证的值
                    let relatedValue = (validationArguments?.object as any)[property]
                    return value === relatedValue
                }
            }
        })
    }
}