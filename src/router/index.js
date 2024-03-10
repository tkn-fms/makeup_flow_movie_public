import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Flowchart from '../views/Flowchart.vue'
import Finish from '../views/Finish.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/flowchart',
    name: 'Flowchart',
    component: Flowchart
    //component: () => import('../views/About.vue')
  },
  {
    path: '/finish',
    name: 'Finish',
    component: Finish
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
