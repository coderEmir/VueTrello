import { getBoards, getBoard, addBoard } from '@/api';

export default {
    namespaced: true,
    state: {
        isInitStore: true,
        boards: null
    },

    getters: {
        getBoard: ({boards}) => id => Array.isArray(boards) ? 
        boards.find(board => board.id === parseInt(id)) : null
    },

    actions: {
        getBoards: async ({ commit }) => {
            let res = await getBoards()
            commit("allBoards", res.data)
            return res
        },
        getBoard: async ({commit},id) => {
            let res = await getBoard(id)
            commit("getBoard", res.data)
            return res
        },
        addBoard: async ({commit}, data) => {
            let res = await addBoard({name: data})
            commit("updateBoards", res.data)
            return res.data
        },
        cleanBoardMemory: ({commit}) => {
            commit("removeBoards")
        }
    },

    mutations: {
        allBoards: (state, boards) => {
            state.boards = boards
            state.isInitStore = false
        },
        updateBoards: (state, board) => {
            console.log(board);
            state.boards.push(board)
        },
        removeBoards: (state) => {
            state.boards = null
        },
        getBoard: (state, board) => {
            state.boards = [board]
            state.isInitStore = true
        },
    }
};
