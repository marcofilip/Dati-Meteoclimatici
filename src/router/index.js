import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/TabellaView.vue'

const routes = [
  {
    path: '/',
    name: 'tabella',
    component: HomeView
  },
  {
    path: '/grafico',
    name: 'grafico',
    component: () => import('../views/GraficoView.vue')
  },
  {
    path: '/tabella2',
    name: 'tabella2',
    component: () => import('../views/TabellaView2.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
