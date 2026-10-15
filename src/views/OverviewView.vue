<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { services } from '../data/services'
import { useAppointments } from '../composables/useAppointments'
import { useResidentProfile } from '../composables/useResidentProfile'

const router = useRouter()
const { appointments, todayAppointments, pendingCount, confirmedCount } = useAppointments()
const { profile } = useResidentProfile()
const today = new Date()
const todayLabel = computed(() => new Intl.DateTimeFormat('en-PH', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
}).format(today).toUpperCase())

function book(serviceName) {
  router.push({ name: 'book', query: serviceName ? { service: serviceName } : {} })
}
</script>

<template>
  <section class="welcome-row">
    <div>
      <div class="eyebrow"><span class="eyebrow-line"></span> {{ todayLabel }}</div>
      <h1>Good morning, {{ profile.name }} <span class="wave">✳</span></h1>
      <p class="welcome-subtitle">Here's what's happening at Barangay Kalinga today.</p>
    </div>
    <button class="button button-primary" @click="book('')"><span>＋</span> Book an appointment</button>
  </section>

  <section class="stat-grid" aria-label="Appointment summary">
    <article class="stat-card">
      <div class="stat-top"><span class="stat-icon icon-violet">▤</span><span class="stat-trend">Today</span></div>
      <div class="stat-value">{{ todayAppointments.length }}</div>
      <div class="stat-label">Appointments today</div>
      <div class="stat-foot"><span class="dot dot-violet"></span> Scheduled for today</div>
    </article>
    <article class="stat-card">
      <div class="stat-top"><span class="stat-icon icon-amber">◷</span><span class="stat-trend trend-warm">Needs attention</span></div>
      <div class="stat-value">{{ pendingCount }}</div>
      <div class="stat-label">Pending requests</div>
      <div class="stat-foot"><span class="dot dot-amber"></span> Awaiting confirmation</div>
    </article>
    <article class="stat-card">
      <div class="stat-top"><span class="stat-icon icon-green">✓</span><span class="stat-trend trend-green">On track</span></div>
      <div class="stat-value">{{ confirmedCount }}</div>
      <div class="stat-label">Confirmed visits</div>
      <div class="stat-foot"><span class="dot dot-green"></span> Ready for your visit</div>
    </article>
    <article class="stat-card stat-card-info">
      <div class="stat-top"><span class="stat-icon icon-blue">⌂</span><span class="stat-trend trend-blue">Your community</span></div>
      <div class="stat-value stat-neighborhood">{{ profile.address || 'Address not provided' }}</div>
      <div class="stat-label">Registered address</div>
      <div class="stat-foot"><span class="dot dot-blue"></span> Resident since {{ profile.residentSince || 'account registration' }}</div>
    </article>
  </section>

  <section class="dashboard-grid">
    <article class="panel appointments-panel">
      <div class="panel-heading">
        <div><h2>Today's appointments</h2><p>Your upcoming barangay visits</p></div>
        <RouterLink class="text-button" :to="{ name: 'appointments' }">View all <span>→</span></RouterLink>
      </div>
      <div v-if="todayAppointments.length" class="today-list">
        <div v-for="appointment in todayAppointments.slice(0, 4)" :key="appointment.id" class="today-row">
          <div class="time-block"><strong>{{ appointment.time.split(' ')[0] }}</strong><small>{{ appointment.time.split(' ')[1] }}</small></div>
          <div class="appointment-avatar">{{ appointment.resident.split(' ').map((part) => part[0]).slice(0, 2).join('') }}</div>
          <div class="today-detail"><strong>{{ appointment.resident }}</strong><small>{{ appointment.service }}</small></div>
          <span class="status-pill" :class="appointment.status.toLowerCase()">{{ appointment.status }}</span>
          <RouterLink class="row-arrow" aria-label="Manage appointment" :to="{ name: 'appointments' }">↗</RouterLink>
        </div>
      </div>
      <div v-else class="empty-state compact-empty"><span>☀</span><strong>A little quiet today</strong><p>No appointments are scheduled for today.</p></div>
      <RouterLink class="schedule-link" :to="{ name: 'appointments' }">Open appointment records <span>→</span></RouterLink>
    </article>

    <article class="panel quick-panel">
      <div class="panel-heading"><div><h2>Quick services</h2><p>What can we help with?</p></div><span class="small-flower">✳</span></div>
      <button v-for="service in services.slice(0, 3)" :key="service.name" class="quick-service" @click="book(service.name)">
        <span class="quick-icon">{{ service.icon }}</span>
        <span><strong>{{ service.name }}</strong><small>{{ service.turnaround }}</small></span>
        <span class="service-arrow">→</span>
      </button>
      <RouterLink class="service-directory" :to="{ name: 'requirements' }">Browse all services <span>→</span></RouterLink>
    </article>
  </section>

  <section class="notice-banner">
    <span class="banner-symbol">✦</span>
    <div><strong>Plan ahead for a smoother visit</strong><p>Check the requirements before your appointment to make sure you have everything you need.</p></div>
    <RouterLink class="button button-light" :to="{ name: 'requirements' }">View requirements <span>→</span></RouterLink>
    <span class="banner-decoration">✳</span>
  </section>
</template>
