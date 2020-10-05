import { getLists, addList, putList} from '@/api'
export default {
    namespaced: true,
    state: {
        boardLists: []
    },
    getters: {
        getLists: ({ boardLists }) => boardListId => Array.isArray(boardLists) ? 
            boardLists.filter(boardList => boardList.boardListId === boardListId) : null
    },
    actions: {
        getLists: async ({commit},boardListId) => {
            let res = await getLists({ boardListId })
            commit("getLists",res.data)
        },
        addList: async ({commit},data) => { 
            let res = await addList(data)
            commit("addList",res.data)
        },
        editList: async ({commit},data) => {
            let res = await putList(data)
            commit("editList",res.data)
        }
    },
    mutations: {
        getLists: (state, data) => {
            state.boardLists.push(...data)
        },
        addList: (state, data) => {
            state.boardLists.push(data)
        },
        editList:(state, data) => {
            state.boardLists = [...state.boardLists, data]
        }
    },

}