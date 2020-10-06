import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

const Home = () => import("../views/Home.vue")
const Board = () => import("../views/Board.vue")
const Card = () => import("../views/Card.vue")
const Register = () => import("../views/Register.vue")
const Login = () => import("../views/Login.vue")
const NotFound = () => import("../views/NotFound.vue")


Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { 
      requiresAuth: true
     }
  },
  {
    path: "/board/:id(\\d+)",
    name: "Board",
    children: [{
      path: "list/:listId(\\d+)/card/:cardId(\\d+)",
      name: "Card",
      props: route => ({ listName: route.params.listName }),
      component: Card,
      
    }],
    component: Board,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/register",
    name: "Register",
    component: Register
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "*",
    name: "NotFound",
    component: NotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 先 利用本地缓存，更新内存仓库的 用户信息
store.commit('user/initUserInfo')

router.beforeEach((to, from, next) => {
  // 如果需要鉴权，验证用户信息，不通过，跳转登录界面
  
  // 是否需要鉴权
  let requiresAuth = to.matched.some(matched => matched.meta.requiresAuth)
  // 用户信息是否为空
  let userInfo = store.state.user.userInfo

  if (requiresAuth && !userInfo) {
    next({name:"Login"})
  }
  else
  {
    next()
  }
  
})

export default router
