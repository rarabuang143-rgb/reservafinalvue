<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { services } from '../data/services'
import { useAppointments } from '../composables/useAppointments'
import AppointmentForm from '../components/AppointmentForm.vue'

const route = useRoute()
const router = useRouter()
const { createAppointment, notice, todayString, formatDate } = useAppointments()
const reviewing = ref(false)
const bookingForm = reactive({
  resident: '',
  phone: '',
  service: services.some((service) => service.name === route.query.service) ? route.query.service : '',
  date: '',
  time: '',
  notes: '',
})
const selectedService = computed(() => services.find((service) => service.name === bookingForm.service))

function reviewBooking() {
  const requiredFields = ['service', 'date', 'time', 'resident', 'phone']
  const hasMissingField = requiredFields.some((field) => !String(bookingForm[field] ?? '').trim())

  if (hasMissingField) {
    notice.value = 'Please complete all required appointment details before continuing.'
    return
  }

  const appointmentDay = new Date(`${bookingForm.date}T00:00:00`).getDay()
  if (appointmentDay === 0 || appointmentDay === 6) {
    notice.value = 'Please choose a weekday. The barangay office is open Monday to Friday.'
    return
  }

  notice.value = ''
  reviewing.value = true
}

function saveBooking() {
  if (createAppointment({ ...bookingForm })) router.push({ name: 'appointments' })
}
</script>

<template>
  <section class="page-heading">
    <div><div class="eyebrow"><span class="eyebrow-line"></span> APPOINTMENT SERVICES</div><h1>Book an appointment</h1><p class="welcome-subtitle">Choose a service and a time that works for you.</p></div>
    <div class="step-indicator"><span :class="reviewing ? 'step-complete' : 'step-active'">{{ reviewing ? '✓' : '1' }}</span><span class="step-line"></span><span :class="reviewing ? 'step-active' : 'step-inactive'">2</span><small>{{ reviewing ? 'Details ✓　 Review' : 'Details　→　 Review' }}</small></div>
  </section>
  <div class="booking-layout">
    <AppointmentForm v-if="!reviewing" :form="bookingForm" :today-string="todayString" @review="reviewBooking" />

    <section v-else class="panel booking-review">
      <div class="review-title-row">
        <div><div class="eyebrow"><span class="eyebrow-line"></span> FINAL CHECK</div><h2>Review your appointment</h2><p>Make sure the details below are correct before saving.</p></div>
        <span class="review-status">Pending confirmation</span>
      </div>
      <div class="review-service">
        <span class="selected-service-icon">{{ selectedService?.icon || '✳' }}</span>
        <div><span class="review-label">SELECTED SERVICE</span><strong>{{ bookingForm.service }}</strong><small>{{ selectedService?.turnaround }} <i>·</i> {{ selectedService?.fee }}</small></div>
      </div>
      <div class="review-details">
        <div><span class="review-label">APPOINTMENT DATE</span><strong>{{ formatDate(bookingForm.date) }}</strong></div>
        <div><span class="review-label">PREFERRED TIME</span><strong>{{ bookingForm.time }}</strong></div>
        <div><span class="review-label">RESIDENT NAME</span><strong>{{ bookingForm.resident }}</strong></div>
        <div><span class="review-label">MOBILE NUMBER</span><strong>{{ bookingForm.phone }}</strong></div>
        <div class="review-notes"><span class="review-label">NOTES</span><strong>{{ bookingForm.notes || 'No additional notes' }}</strong></div>
      </div>
      <div class="review-reminder"><span>✧</span><p>Bring a valid ID and the required documents when you visit the barangay hall.</p><RouterLink :to="{ name: 'requirements' }">View requirements →</RouterLink></div>
      <div class="form-actions review-actions">
        <button class="button button-outline" type="button" @click="reviewing = false">← Back to details</button>
        <button class="button button-primary" type="button" @click="saveBooking">Save appointment <span>✓</span></button>
      </div>
    </section>

    <aside class="booking-aside">
      <article class="panel selected-service-card">
        <div class="aside-overline">YOUR APPOINTMENT</div>
        <div class="selected-service-icon">{{ selectedService?.icon || '✳' }}</div>
        <h3>{{ selectedService?.name || 'Select a service' }}</h3>
        <p>{{ selectedService?.description || 'Choose from our available barangay services to get started.' }}</p>
        <div class="aside-divider"></div>
        <div class="aside-info"><span>Typical processing</span><strong>{{ selectedService?.turnaround || 'Varies by service' }}</strong></div>
        <div class="aside-info"><span>Service fee</span><strong>{{ selectedService?.fee || 'See service details' }}</strong></div>
      </article>
      <article class="requirement-tip">
        <span>✧</span><div><strong>Bring your requirements</strong><p>Don't forget to bring a valid ID and any documents needed for your selected service.</p><RouterLink :to="{ name: 'requirements' }">See what's needed →</RouterLink></div>
      </article>
    </aside>
  </div>
</template>
