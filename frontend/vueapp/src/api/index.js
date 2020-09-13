import axios from 'axios';
import TMessage from '../components/TMessage/TMessage.js'

axios.defaults.baseURL = process.env.VUE_APP_SERVER_API_PATH;

axios.interceptors.request.use(configs=>{
    // 配置请求头
    try {
        let { authorization } = JSON.parse(localStorage.getItem("user"))        
        configs.headers.common.authorization = authorization
        return configs
    }catch(e){
        console.log(e);
    }    
})

axios.interceptors.response.use(response => {
    console.log("response", response);
    return response
}, error => {
    let { message, errorDetails } = error.response.data;
    if (errorDetails) {
        message += ' : ' + errorDetails;
    }
    TMessage.error(message);
    throw error
},)
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