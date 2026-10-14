<script setup>
import { useRouter } from 'vue-router'
import { services } from '../data/services'

const router = useRouter()
</script>

<template>
  <section class="page-heading">
    <div><div class="eyebrow"><span class="eyebrow-line"></span> PROJECT DOCUMENTATION</div><h1>Requirements & development</h1><p class="welcome-subtitle">The system scope, resident needs, and VueJS development process.</p></div>
    <button class="button button-primary" @click="router.push({ name: 'book' })"><span>＋</span> Try appointment booking</button>
  </section>

  <div class="requirements-intro"><div class="intro-icon">✧</div><div><strong>Project goal: make barangay services easier to access</strong><p>Residents can find requirements, request appointments, and keep track of service visits from one simple portal.</p></div><span class="intro-badge">VUE 3 SPA</span></div>

  <section class="project-doc-grid">
    <article class="panel project-doc-card">
      <div class="project-doc-heading"><span class="catalog-icon catalog-color-1">✓</span><div><h2>Functional requirements</h2><p>What the appointment system must do.</p></div></div>
      <ul class="project-check-list">
        <li>Navigate between home, dashboard, appointments, residents, requirements, settings, and booking.</li>
        <li>Create appointment requests and review details before saving.</li>
        <li>View, search, filter, update, and delete appointment records.</li>
        <li>Manage resident contact and address records.</li>
        <li>Show service fees, processing times, and required documents.</li>
        <li>Save demo records and preferences in browser local storage.</li>
      </ul>
    </article>
    <article class="panel project-doc-card">
      <div class="project-doc-heading"><span class="catalog-icon catalog-color-2">◇</span><div><h2>Quality requirements</h2><p>Expected usability and technical qualities.</p></div></div>
      <ul class="project-check-list">
        <li>Responsive layout that works on desktop and smaller screens.</li>
        <li>Clear labels, accessible controls, and validation feedback.</li>
        <li>Separate reusable components, routed page views, data, and shared logic.</li>
        <li>Keep resident information local in this prototype; do not imply server security.</li>
        <li>Build without errors and verify important user flows in the browser.</li>
      </ul>
    </article>
  </section>

  <section class="panel development-panel">
    <div class="panel-heading"><div><h2>VueJS development process</h2><p>How the resident appointment SPA is organized and built.</p></div><span class="intro-badge">5 STEPS</span></div>
    <div class="development-steps">
      <article><span>01</span><div><strong>Gather requirements</strong><p>Identify resident needs, services, appointment information, and CRUD operations.</p></div></article>
      <article><span>02</span><div><strong>Plan the pages and routes</strong><p>Map the landing, authentication demo, dashboard, booking, records, residents, requirements, and settings views.</p></div></article>
      <article><span>03</span><div><strong>Build reusable Vue components</strong><p>Use shared navigation and appointment form components, with independent view components for each page.</p></div></article>
      <article><span>04</span><div><strong>Implement data and CRUD</strong><p>Keep service data separate; use shared appointment state and browser storage for this front-end prototype.</p></div></article>
      <article><span>05</span><div><strong>Validate and improve</strong><p>Check forms, weekday scheduling, review-before-save, navigation, and the production build.</p></div></article>
    </div>
  </section>

  <div class="service-doc-heading"><div><div class="eyebrow"><span class="eyebrow-line"></span> RESIDENT SERVICE CATALOG</div><h2>Service documents & fees</h2><p>Examples used by the booking flow and resident requirements screens.</p></div><span class="intro-badge">4 SERVICES</span></div>
  <section class="service-catalog">
    <article v-for="(service, index) in services" :key="service.name" class="panel catalog-card">
      <div class="catalog-top"><span class="catalog-icon" :class="`catalog-color-${index + 1}`">{{ service.icon }}</span><span class="catalog-fee">{{ service.fee }}</span></div>
      <h2>{{ service.name }}</h2><p class="catalog-description">{{ service.description }}</p>
      <div class="catalog-meta"><span>◷ {{ service.turnaround }}</span><span>Resident service</span></div>
      <div class="catalog-requirements"><strong>What to bring</strong><ul><li v-for="requirement in service.requirements" :key="requirement">{{ requirement }}</li></ul></div>
      <button class="button button-outline" @click="router.push({ name: 'book', query: { service: service.name } })">Book this service <span>→</span></button>
    </article>
  </section>
  <section class="office-hours-card">
    <div class="office-hours-icon">⌂</div><div><strong>Visit the Barangay Hall</strong><p>123 Mabini Street, Barangay Kalinga, Quezon City</p></div>
    <div class="office-hours-detail"><span>OFFICE HOURS</span><strong>Monday – Friday · 8:00 AM – 5:00 PM</strong></div>
    <a href="https://maps.google.com/?q=Barangay+Hall+Quezon+City" target="_blank" rel="noreferrer">Get directions ↗</a>
  </section>
</template>
