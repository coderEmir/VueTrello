import * as api from '@/api'

export default {

    namespaced: true,

    state: {},

    actions: {

        getComments: async (store, params) => {

            return api.getComments(params);

        },

        postComment: async (store, data) => {
            data = { boardListCardId: parseInt(data.boardListCardId),content: data.content}
            console.log("postComment",data);
            return api.postComment(data);
        }

    }

}