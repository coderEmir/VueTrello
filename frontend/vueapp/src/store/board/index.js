import { allBoards, addBoard } from '@/api';

export default {
    namespaced: true,
    state: {
        boards: null
    },
    actions: {
        getBoards: async ({ commit }) => {
            console.log("getBoards");
            let res = await allBoards()
            commit("allBoards", res.data)
            return res
        },
        addBoard: async ({commit}, data) => {
            let res = await addBoard({name: data})
            commit("updateBoards", res.data)
            return res.data
        }
    },

    mutations: {
        allBoards: (state, boards) => {
            
            state.boards = boards
        },
        updateBoards: (state, board) => {
            console.log(board);
            state.boards.push(board)
        }
    }
};
