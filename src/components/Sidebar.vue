<script setup>
import { RouterLink } from 'vue-router'
import brandMark from '../assets/brand-mark.svg'
import { useAppointments } from '../composables/useAppointments'
import { useResidentProfile } from '../composables/useResidentProfile'

const { appointments } = useAppointments()
const { profile } = useResidentProfile()
</script>

<template>
  <aside class="sidebar">
    <RouterLink class="brand" to="/app/dashboard">
      <img class="brand-mark" :src="brandMark" alt="">
      <span class="brand-copy"><strong>Barangay</strong><small>Kalinga · Resident Portal</small></span>
    </RouterLink>

    <div class="nav-label">WORKSPACE</div>
    <nav class="side-nav" aria-label="Main navigation">
      <RouterLink to="/app/dashboard" active-class="active"><span class="nav-icon">⌂</span> Home</RouterLink>
      <RouterLink to="/app/appointments" active-class="active"><span class="nav-icon">▤</span> Appointments <span class="nav-count">{{ appointments.length }}</span></RouterLink>
      <RouterLink to="/app/residents" active-class="active"><span class="nav-icon">♙</span> Residents</RouterLink>
      <RouterLink to="/app/requirements" active-class="active"><span class="nav-icon">◇</span> Requirements</RouterLink>
      <RouterLink to="/app/settings" active-class="active"><span class="nav-icon">⚙</span> Settings</RouterLink>
      <RouterLink to="/app/book" active-class="active"><span class="nav-icon">＋</span> Book appointments</RouterLink>
    </nav>

    <div class="sidebar-bottom">
      <div class="help-card">
        <div class="help-icon">i</div>
        <strong>Need a hand?</strong>
        <p>Our barangay staff is happy to help.</p>
        <a href="tel:+63281234567">Call (02) 8123 4567 <span>↗</span></a>
      </div>
      <RouterLink class="profile-button" to="/app/profile">
        <span class="avatar">{{ profile.name.split(' ').map((part) => part[0]).slice(0, 2).join('') || 'R' }}</span>
        <span class="profile-copy"><strong>{{ profile.name }}</strong><small>Resident profile</small></span>
        <span class="profile-menu">•••</span>
      </RouterLink>
    </div>
  </aside>
</template>
