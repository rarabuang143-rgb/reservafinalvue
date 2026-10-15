<script setup>
import { ref } from 'vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
})

const notifications = ref([
  { title: 'Appointment reminder', message: 'Your barangay clearance is due tomorrow at 9:00 AM.', time: '2h ago' },
  { title: 'Service update', message: 'Requirements for business clearance have been refreshed.', time: 'Today' },
])
const showNotifications = ref(false)

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
}
</script>

<template>
  <header class="topbar">
    <div class="breadcrumb"><span>Resident portal</span><span class="crumb-divider">/</span><strong>{{ title }}</strong></div>
    <div class="topbar-actions">
      <div class="office-status"><span></span> Office open <small>· 8:00 AM – 5:00 PM</small></div>
      <div class="notification-wrapper">
        <button class="icon-button notification-button" aria-label="Notifications" :aria-expanded="showNotifications" @click="toggleNotifications">
          <span>♧</span>
          <i v-if="notifications.length"></i>
        </button>
        <div v-if="showNotifications" class="notification-panel" role="dialog" aria-live="polite">
          <div class="notification-header">
            <strong>Notifications</strong>
            <span>{{ notifications.length }}</span>
          </div>
          <div v-for="item in notifications" :key="item.title" class="notification-item">
            <strong>{{ item.title }}</strong>
            <p>{{ item.message }}</p>
            <small>{{ item.time }}</small>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
