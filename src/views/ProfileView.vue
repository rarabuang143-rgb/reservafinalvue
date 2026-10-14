<script setup>
import { useRouter } from 'vue-router'
import { useAppointments } from '../composables/useAppointments'
import { useResidentProfile } from '../composables/useResidentProfile'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { appointments, todayAppointments } = useAppointments()
const { profile } = useResidentProfile()
const { logout } = useAuth()

function signOut() {
  logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <section class="page-heading">
    <div><div class="eyebrow"><span class="eyebrow-line"></span> RESIDENT ACCOUNT</div><h1>My profile</h1><p class="welcome-subtitle">Your resident details and appointment access.</p></div>
    <div class="profile-heading-actions">
      <button class="button button-outline" @click="signOut">Log out</button>
      <button class="button button-primary" @click="router.push({ name: 'book' })"><span>＋</span> Book appointments</button>
    </div>
  </section>

  <div class="profile-layout">
    <section class="panel profile-card">
      <div class="profile-banner"></div>
      <div class="profile-details">
        <div class="profile-large-avatar">{{ profile.name.split(' ').map((part) => part[0]).slice(0, 2).join('') || 'R' }}</div>
        <span class="resident-badge"><span></span> Resident account</span>
        <h2>{{ profile.name }}</h2>
        <p class="profile-subtitle">Resident of Barangay Kalinga since {{ profile.residentSince || 'account registration' }}</p>
        <div class="profile-info-grid">
          <div><span>Mobile number</span><strong>{{ profile.phone || 'Not provided' }}</strong></div>
          <div><span>Email address</span><strong>{{ profile.email || 'Not provided' }}</strong></div>
          <div><span>Login username</span><strong>{{ profile.username || 'Not signed in' }}</strong></div>
          <div><span>Address</span><strong>{{ profile.address || 'Not provided' }}</strong></div>
          <div><span>Barangay</span><strong>{{ profile.barangay }}</strong></div>
          <div v-if="profile.lastLogin"><span>Last login</span><strong>{{ new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(profile.lastLogin)) }}</strong></div>
        </div>
      </div>
    </section>

    <aside class="profile-side">
      <section class="panel profile-appointments">
        <div class="profile-panel-heading"><div><h2>My appointments</h2><p>Your saved service requests</p></div><span class="profile-appointment-count">{{ appointments.length }}</span></div>
        <div class="profile-stat-row"><span>Scheduled for today</span><strong>{{ todayAppointments.length }}</strong></div>
        <div class="profile-stat-row"><span>All appointment records</span><strong>{{ appointments.length }}</strong></div>
        <button class="button button-outline profile-records-button" @click="router.push({ name: 'appointments' })">Manage appointment records <span>→</span></button>
      </section>
      <section class="profile-contact-card">
        <span class="profile-contact-icon">i</span>
        <div><strong>Need to update your details?</strong><p>Please contact the barangay office to update resident information.</p><a href="tel:+63281234567">Call (02) 8123 4567 ↗</a></div>
      </section>
    </aside>
  </div>
</template>
