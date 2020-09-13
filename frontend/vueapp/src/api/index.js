import axios from 'axios';
import TMessage from '../components/TMessage/TMessage.js'
axios.defaults.baseURL = process.env.VUE_APP_SERVER_API_PATH;

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

export const register = data => {

    return axios({
        method: 'post',
        url: '/user/register',
        data
    })
}