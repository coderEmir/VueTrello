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
export const getBoards = () => {
    return axios({
        url: '/board/getBoards'
    })
}

export const getBoard = parma => {
    return axios({
        url: '/board/' + parma
    })
}

export const addBoard = data => {
    return axios({
        method: 'post',
        url: '/board',
        data
    })
}

export const getLists = params => {
    console.log("getLists");
    return axios({
        url: '/list',
        params
    })
}

export const addList = data => {
    return axios({
        method:'post',
        url: '/list',
        data
    })
}

export const deleteList = params => {
    return axios({
        method:'delete',
        url:'/list/'+params.id
    })
}

// 编辑一个指定的列表
export const putList = data => {
    return axios({
        method: 'put',
        url: '/list/' + data.id,
        data: {
            boardListId: data.boardId,
            order: data.order
        }
    })
};

// 获取一个指定列表下的所有卡片
export const getCards = boardListId => {
    return axios({
        url: '/card',
        params: {
            boardListId
        }
    })
};
// 添加一张卡片
export const postCard = data => {
    return axios({
        method: 'post',
        url: '/card',
        data
    })
};
// 编辑一个指定的卡片
export const putCard = data => {
    return axios({
        method: 'put',
        url: '/card/' + data.id,
        data: {
            boardListId: data.boardListId,
            name: data.name,
            description: data.description,
            order: data.order
        }
    })
};

// 上传附件
export const uploadAttachment = data => {
    let fd = new FormData();
    fd.append('boardListCardId', data.boardListCardId);
    fd.append('attachment', data.file);

    return axios({
        method: 'post',
        url: '/card/attachment',
        data: fd
    })
};
// 删除附件
export const removeAttachment = data => {
    return axios({
        method: 'delete',
        url: '/card/attachment/' + data.id
    });
};
// 设置封面
export const setCover = data => {
    return axios({
        method: 'put',
        url: '/card/attachment/cover/' + data.id
    });
};
// 移除封面
export const removeCover = data => {
    return axios({
        method: 'delete',
        url: '/card/attachment/cover/' + data.id
    });
};

// 获取评论列表
export const getComments = params => {
    return axios({
        url: '/comment',
        params
    })
};
// 添加评论
export const postComment = data => {
    return axios({
        method: 'post',
        url: '/comment',
        data
    })
};