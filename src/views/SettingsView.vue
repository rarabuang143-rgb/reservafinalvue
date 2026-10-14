<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useResidentProfile } from '../composables/useResidentProfile'

const STORAGE_KEY = 'barangay-kalinga-settings'
const { profile } = useResidentProfile()
const settings = reactive({
  appointmentReminders: true,
  serviceUpdates: true,
  compactRecords: false,
})
const savedMessage = ref('')

onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) Object.assign(settings, JSON.parse(saved))
  } catch (error) {
    console.error('Could not load portal preferences:', error)
    savedMessage.value = 'Preferences could not be loaded from this device.'
  }
})

function saveSettings() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    savedMessage.value = 'Your preferences have been saved on this device.'
  } catch (error) {
    console.error('Could not save portal preferences:', error)
    savedMessage.value = 'Preferences could not be saved on this device.'
  }
}
</script>

<template>
  <section class="page-heading">
    <div><div class="eyebrow"><span class="eyebrow-line"></span> PORTAL PREFERENCES</div><h1>Settings</h1><p class="welcome-subtitle">Choose how the resident portal works for you.</p></div>
  </section>
  <div class="settings-layout">
    <section class="panel settings-panel">
      <div class="settings-section-heading"><span class="settings-icon">♧</span><div><h2>Notifications</h2><p>Choose the updates you want to see.</p></div></div>
      <label class="preference-row"><span><strong>Appointment reminders</strong><small>Show reminders for upcoming appointments.</small></span><input v-model="settings.appointmentReminders" type="checkbox"><i></i></label>
      <label class="preference-row"><span><strong>Barangay service updates</strong><small>See announcements about service hours and requirements.</small></span><input v-model="settings.serviceUpdates" type="checkbox"><i></i></label>
      <div class="settings-section-heading settings-display-heading"><span class="settings-icon">▤</span><div><h2>Display</h2><p>Adjust how information is shown.</p></div></div>
      <label class="preference-row"><span><strong>Compact appointment records</strong><small>Use a condensed layout in appointment lists.</small></span><input v-model="settings.compactRecords" type="checkbox"><i></i></label>
      <div class="settings-actions"><span v-if="savedMessage" role="status">{{ savedMessage }}</span><button class="button button-primary" @click="saveSettings">Save preferences <span>✓</span></button></div>
    </section>
    <aside class="settings-aside">
      <section class="panel settings-account">
        <div class="settings-section-heading"><span class="settings-icon">◉</span><div><h2>Resident account</h2><p>Signed in as {{ profile.name }}</p></div></div>
        <RouterLink class="settings-account-link" to="/app/profile">View resident profile <span>→</span></RouterLink>
      </section>
      <section class="settings-note"><strong>About this prototype</strong><p>These preferences are stored in this browser only. This demonstration does not use a shared barangay server.</p></section>
    </aside>
  </div>
</template>
