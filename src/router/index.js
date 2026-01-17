import CharactersView from '@/views/CharactersView.vue'
import FavoritesView from '@/views/FavoritesView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { estaAutenticado } from '@/servicios/autenticacion.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/personajes' },
    { path: '/personajes', component: CharactersView },
    { path: '/register', component: RegisterView },
    { path: '/login', component: LoginView },
    { path: '/favoritos', component: FavoritesView, meta: { requiresAuth: true } },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (estaAutenticado()) {
      next() // permitimos el acceso
    } else {
      next('/login') // redirigimos al login
    }
  } else {
    next() // permitimos el acceso a rutas públicas
  }
})


export default router
