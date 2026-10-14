import { createRouter, createWebHashHistory } from 'vue-router'
import OverviewView from '../views/OverviewView.vue'
import BookAppointmentView from '../views/BookAppointmentView.vue'
import AppointmentsView from '../views/AppointmentsView.vue'
import RequirementsView from '../views/RequirementsView.vue'
import ProfileView from '../views/ProfileView.vue'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import AppLayout from '../components/AppLayout.vue'
import ResidentsView from '../views/ResidentsView.vue'
import SettingsView from '../views/SettingsView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'public-home', component: HomeView },
    { path: '/home', redirect: '/' },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    {
      path: '/app',
      meta: { requiresAuth: true },
      component: AppLayout,
      children: [
        { path: '', redirect: { name: 'dashboard' } },
        { path: 'dashboard', name: 'dashboard', component: OverviewView },
        { path: 'book', name: 'book', component: BookAppointmentView },
        { path: 'appointments', name: 'appointments', component: AppointmentsView },
        { path: 'residents', name: 'residents', component: ResidentsView },
        { path: 'requirements', name: 'requirements', component: RequirementsView },
        { path: 'profile', name: 'profile', component: ProfileView },
        { path: 'settings', name: 'settings', component: SettingsView },
      ],
    },
    { path: '/dashboard', redirect: { name: 'dashboard' } },
    { path: '/book', redirect: { name: 'book' } },
    { path: '/appointments', redirect: { name: 'appointments' } },
    { path: '/residents', redirect: { name: 'residents' } },
    { path: '/requirements', redirect: { name: 'requirements' } },
    { path: '/profile', redirect: { name: 'profile' } },
    { path: '/settings', redirect: { name: 'settings' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
})

router.beforeEach((to) => {
  if (!to.matched.some((record) => record.meta.requiresAuth)) return true
  try {
    if (localStorage.getItem('barangay-kalinga-session')) return true
  } catch (error) {
    console.error('Could not check the resident login session:', error)
  }
  return { name: 'login', query: { redirect: to.fullPath } }
})

export default router
