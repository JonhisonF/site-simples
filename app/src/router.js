import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Form from './views/Form.vue'
import FormAction from './views/FormAction.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/form', component: Form },
    { path: '/formAction', component: FormAction }
  ]
})
