import { register, login } from '@/api'

const state = {
    // 用户信息
    userInfo: {}
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
    login: async (state, data) => {
        
        let req = await login(data)
        
        state.commit("userInfo", { ...req.data.data, authorization : req.headers.authorization})
        return req                        
    },
    logout: async ({commit}) => {
        commit("removeUserInfo")
    }
}
const mutations = {
    userInfo: (state, userInfo)=> {
        state.userInfo = userInfo
        localStorage.setItem("user", JSON.stringify(userInfo))
    },
    initUserInfo: state => {
        state.userInfo = JSON.parse(localStorage.getItem("user"))   
    },
    removeUserInfo: state => {
        state.userInfo = undefined
        localStorage.removeItem("user")
    }
}
export default {
    namespaced: true,
    state,
    actions,
    mutations
}