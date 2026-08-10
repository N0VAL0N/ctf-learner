import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/lessons', name: 'lessons', component: () => import('../views/LessonsView.vue') },
  { path: '/lesson/:id', name: 'lesson-detail', component: () => import('../views/LessonDetailView.vue'), props: true },
  { path: '/compiler', name: 'compiler', component: () => import('../views/CompilerView.vue') },
  { path: '/practice', name: 'practice', component: () => import('../views/PracticeView.vue') },
  { path: '/library', name: 'library', component: () => import('../views/LibraryView.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router