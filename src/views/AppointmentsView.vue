<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { services } from '../data/services'
import { useAppointments } from '../composables/useAppointments'

const router = useRouter()
const { appointments, updateAppointment, updateStatus, deleteAppointment, formatDate, todayString } = useAppointments()
const searchQuery = ref('')
const filterStatus = ref('All')
const editorOpen = ref(false)
const editingId = ref(null)
const compactRecords = ref(false)
const bookingForm = reactive({ resident: '', phone: '', service: '', date: '', time: '', notes: '' })
const visibleAppointments = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return appointments.value
    .filter((appointment) => filterStatus.value === 'All' || appointment.status === filterStatus.value)
    .filter((appointment) => (
      !query ||
      appointment.resident.toLowerCase().includes(query) ||
      appointment.id.toLowerCase().includes(query) ||
      appointment.service.toLowerCase().includes(query)
    ))
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
})
const pendingCount = computed(() => appointments.value.filter((appointment) => appointment.status === 'Pending').length)
const confirmedCount = computed(() => appointments.value.filter((appointment) => appointment.status === 'Confirmed').length)
const completedCount = computed(() => appointments.value.filter((appointment) => appointment.status === 'Completed').length)

onMounted(() => {
  try {
    const savedSettings = localStorage.getItem('barangay-kalinga-settings')
    compactRecords.value = savedSettings ? JSON.parse(savedSettings).compactRecords === true : false
  } catch (error) {
    console.error('Could not load appointment display preference:', error)
  }
})

function editAppointment(appointment) {
  editingId.value = appointment.id
  Object.assign(bookingForm, {
    resident: appointment.resident,
    phone: appointment.phone,
    service: appointment.service,
    date: appointment.date,
    time: appointment.time,
    notes: appointment.notes,
  })
  editorOpen.value = true
}

function saveEdit() {
  if (updateAppointment(editingId.value, { ...bookingForm })) editorOpen.value = false
}
</script>

<template>
  <section class="page-heading records-heading">
    <div><div class="eyebrow"><span class="eyebrow-line"></span> RESIDENT SERVICES</div><h1>Appointment records</h1><p class="welcome-subtitle">Review, update, or cancel your barangay appointments.</p></div>
    <button class="button button-primary" @click="router.push({ name: 'book' })"><span>＋</span> New appointment</button>
  </section>

  <section class="record-summary">
    <div><span class="summary-label">All appointments</span><strong>{{ appointments.length }}</strong></div>
    <div><span class="summary-label"><i class="mini-dot amber"></i> Pending</span><strong>{{ pendingCount }}</strong></div>
    <div><span class="summary-label"><i class="mini-dot green"></i> Confirmed</span><strong>{{ confirmedCount }}</strong></div>
    <div><span class="summary-label"><i class="mini-dot blue"></i> Completed</span><strong>{{ completedCount }}</strong></div>
  </section>

  <section class="panel records-panel" :class="{ 'compact-records': compactRecords }">
    <div class="records-toolbar">
      <div><h2>All appointments</h2><p>Manage your appointment requests and visits.</p></div>
      <div class="table-tools">
        <label class="search-field"><span>⌕</span><input v-model="searchQuery" type="search" placeholder="Search appointments"></label>
        <select v-model="filterStatus" aria-label="Filter by status" class="filter-select"><option>All</option><option>Pending</option><option>Confirmed</option><option>Completed</option></select>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>APPOINTMENT</th><th>SERVICE</th><th>DATE & TIME</th><th>STATUS</th><th><span class="sr-only">Actions</span></th></tr></thead>
        <tbody>
          <tr v-for="appointment in visibleAppointments" :key="appointment.id">
            <td><div class="resident-cell"><span class="table-avatar">{{ appointment.resident.split(' ').map((part) => part[0]).slice(0, 2).join('') }}</span><span><strong>{{ appointment.resident }}</strong><small>{{ appointment.id }}</small></span></div></td>
            <td><strong class="service-cell">{{ appointment.service }}</strong></td>
            <td><strong class="date-cell">{{ formatDate(appointment.date) }}</strong><small class="time-cell">{{ appointment.time }}</small></td>
            <td><select class="status-select" :class="appointment.status.toLowerCase()" :value="appointment.status" :aria-label="`Status for ${appointment.id}`" @change="updateStatus(appointment, $event.target.value)"><option>Pending</option><option>Confirmed</option><option>Completed</option></select></td>
            <td><div class="action-buttons"><button aria-label="Edit appointment" title="Edit" @click="editAppointment(appointment)">✎</button><button aria-label="Delete appointment" title="Delete" @click="deleteAppointment(appointment)">×</button></div></td>
          </tr>
          <tr v-if="visibleAppointments.length === 0"><td colspan="5"><div class="empty-state"><span>⌕</span><strong>No appointments found</strong><p>Try changing your search or status filter.</p></div></td></tr>
        </tbody>
      </table>
    </div>
    <div class="table-footer"><span>Showing <strong>{{ visibleAppointments.length }}</strong> of <strong>{{ appointments.length }}</strong> appointments</span><span>Changes are saved on this device <b>✓</b></span></div>
  </section>
  <p class="records-help">Need to reschedule? Update your appointment details or contact the barangay office at <a href="tel:+63281234567">(02) 8123 4567</a>.</p>

  <div v-if="editorOpen" class="modal-backdrop" @click.self="editorOpen = false">
    <form class="modal-card" @submit.prevent="saveEdit">
      <div class="modal-heading"><div><div class="eyebrow"><span class="eyebrow-line"></span> UPDATE RECORD</div><h2>Edit appointment</h2></div><button type="button" class="modal-close" aria-label="Close dialog" @click="editorOpen = false">×</button></div>
      <p class="modal-description">Update the appointment details below. Changes are saved to this device.</p>
      <label class="field-label">Full name<input v-model="bookingForm.resident" type="text" required></label>
      <label class="field-label">Mobile number<input v-model="bookingForm.phone" type="tel" required></label>
      <label class="field-label">Service<select v-model="bookingForm.service" required><option v-for="service in services" :key="service.name">{{ service.name }}</option></select></label>
      <div class="form-two-col">
        <label class="field-label">Date<input v-model="bookingForm.date" type="date" :min="todayString" required></label>
        <label class="field-label">Time<select v-model="bookingForm.time" required><option>08:00 AM</option><option>09:00 AM</option><option>10:00 AM</option><option>10:30 AM</option><option>01:00 PM</option><option>01:30 PM</option><option>02:00 PM</option><option>03:00 PM</option></select></label>
      </div>
      <label class="field-label">Notes <span>(optional)</span><textarea v-model="bookingForm.notes" rows="2"></textarea></label>
      <div class="modal-actions"><button type="button" class="button button-outline" @click="editorOpen = false">Cancel</button><button type="submit" class="button button-primary">Save changes <span>→</span></button></div>
    </form>
  </div>
</template>
