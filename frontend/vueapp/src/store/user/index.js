import { register } from '@/api'

const state = {
    // 类别数据 表格 树结构
    classTreeData: [],
}
const actions = {
    // 必须写成对象
    /**
     * 错误写法：
     * register(state,data) {}
     * */ 
    register: (state, data) => {
        return register(data);
    },
}
const mutations = {
    
}
export default {
    namespaced: true,
    state,
    actions,
    mutations
}