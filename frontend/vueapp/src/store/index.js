import Vue from 'vue'
import Vuex from 'vuex'
import user from './user';
import board from './board'
import list from './list'
import card from './card'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    server: {
      staticPath: process.env.VUE_APP_SERVER_STATIC_PATH
    }
  },
  modules: {
    // 将仓库划分小的模块
    user,
    board,
    list,
    card
  }
})
