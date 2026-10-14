<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useAppointments } from '../composables/useAppointments'
import Navbar from './Navbar.vue'
import Sidebar from './Sidebar.vue'

const route = useRoute()
const { notice } = useAppointments()
const title = computed(() => ({
  dashboard: 'Home',
  book: 'Book appointments',
  appointments: 'Appointment records',
  residents: 'Residents',
  requirements: 'Services & requirements',
  profile: 'Resident profile',
  settings: 'Settings',
}[route.name] || 'Overview'))
</script>

<template>
  <div class="app-shell">
    <Sidebar />

    <main class="main-area">
      <Navbar :title="title" />

      <div class="page-content">
        <div v-if="notice" class="notice" role="status">
          <span>{{ notice }}</span>
          <button aria-label="Dismiss notification" @click="notice = ''">×</button>
        </div>
        <RouterView />
      </div>
      <footer class="page-footer"><span>© 2026 Barangay Kalinga <i>·</i> Serving our community with care.</span><span>Made for residents <b>♥</b></span></footer>
    </main>
  </div>
</template>
