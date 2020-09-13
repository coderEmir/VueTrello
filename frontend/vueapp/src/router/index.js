import Vue from 'vue'
import VueRouter from 'vue-router'
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
    component: Home
  },
  {
    path: "/board/:id(\\d+)",
    name: "Board",
    children: [{
      path: "list/:listId(\\d+)/card/:cardId(\\d+)",
      name: "Card",
      component: Card
    }],
    component: Board
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

export default router
