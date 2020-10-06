import Vue from 'vue';
import TMessage from "./TMessage.vue";

const TMessageClass = Vue.extend(TMessage);
/**
 * 保存弹框
 */
let instances = [];
/**
* 工厂函数
*  创建一个TMessage组件对象
*  管理TMessage组件对象队列
*/
function Message(data) {
  data = data || {};
    if (typeof data === 'string') {
        data = {
            message: data
        }
    }

    // 添加关闭事件回调
    data.onClose = function () {

        Message.close(instance);
    };

    let instance = new TMessageClass({
        data
    });

    instance.$mount();
    document.body.appendChild(instance.$el);

    let offset = data.offset || 20;
    let offsetTop = offset;
    instances.forEach((item,index) => {
        // 只计算未移除的增节点
        if (item.$el.offsetHeight) {
            offsetTop += item.$el.offsetHeight + offset;            
        }
        else
        {
            instances.splice(index,1)
        }
    });

    instance.$el.style.top = offsetTop + 'px';

    instances.push(instance);
}
/**
 * 实现提示类型的批量静态方法处理
 */
['info', 'success', 'error', 'warning'].forEach(type => {
    Message[type] = function (data) {
        if (data) {
            if (typeof data === 'string') {
                data = {
                    message: data
                }
            }
            data.type = type || "error";
        }
        
        return Message(data);
    };
});

/**
 * 实现提示框的有序消失
*/
Message.close = function (instance) {
    /*
    * 获取当前这个instance的高度
    * 把instance后面的所有实例的top减去这个高度，再减去偏移
    * */
    let removeHeight = instance.$el.offsetHeight + instance.offset;
    let index = instances.findIndex(item => item === instance);
    instances = instances.filter(item => item !== instance);

    for (let i = index; i < instances.length; i++) {
        instances[i].$el.style.top = parseFloat(instances[i].$el.style.top) - removeHeight + 'px';
    }
};


export default Message;