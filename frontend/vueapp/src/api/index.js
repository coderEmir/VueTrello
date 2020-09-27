import axios from 'axios';
import TMessage from '../components/TMessage/TMessage.js'

axios.defaults.baseURL = process.env.VUE_APP_SERVER_API_PATH;

axios.interceptors.request.use(configs=>{
    // 配置请求头
    try {
        let userInfo = JSON.parse(localStorage.getItem("user"))        
        if (userInfo && userInfo.authorization) {
            configs.headers.common.authorization = userInfo.authorization
        }
        return configs
    }catch(e){
        console.log(e);
    }    
})

axios.interceptors.response.use(response => {
    return response
}, error => {
    let { message, errorDetails } = error.response.data;
    if (errorDetails) {
        message += ' : ' + errorDetails;
    }
    TMessage.error(message);
    throw error
},)
// user
// 注册
export const register = data => {

    return axios({
        method: 'post',
        url: '/user/register',
        data
    })
}
// 登录
export const login = data => {
    return axios({
        method: 'post',
        url: '/user/login',
        data
    })
}

// board
// 获取所有面板
export const allBoards = () => {
    return axios({
        method: 'get',
        url: '/board/getBoards'
    })
}

export const addBoard = data => {
    return axios({
        method: 'post',
        url: '/board',
        data
    })
}