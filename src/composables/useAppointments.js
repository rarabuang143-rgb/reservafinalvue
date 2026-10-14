import { computed, ref, watch } from 'vue'
import { useResidentProfile } from './useResidentProfile'

const STORAGE_KEY = 'barangay-kalinga-appointments'
const today = new Date()
const todayString = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
  .toISOString()
  .slice(0, 10)

const seedAppointments = [
  {
    id: 'BA-2026-0142',
    resident: 'Maria Santos',
    phone: '0917 555 0142',
    service: 'Barangay Clearance',
    date: todayString,
    time: '09:00 AM',
    status: 'Confirmed',
    notes: 'For employment requirements',
  },
  {
    id: 'BA-2026-0138',
    resident: 'Juan Dela Cruz',
    phone: '0928 310 8821',
    service: 'Certificate of Residency',
    date: todayString,
    time: '10:30 AM',
    status: 'Pending',
    notes: '',
  },
  {
    id: 'BA-2026-0131',
    resident: 'Angela Reyes',
    phone: '0995 321 0064',
    service: 'Business Clearance',
    date: todayString,
    time: '01:30 PM',
    status: 'Completed',
    notes: 'Renewal',
  },
]

const notice = ref('')
const { accountId } = useResidentProfile()
const appointments = ref(loadAppointments(accountId.value))
const todayAppointments = computed(() => appointments.value.filter((appointment) => appointment.date === todayString))
const pendingCount = computed(() => appointments.value.filter((appointment) => appointment.status === 'Pending').length)
const confirmedCount = computed(() => appointments.value.filter((appointment) => appointment.status === 'Confirmed').length)

function storageKeyForAccount(id) {
  return id ? `${STORAGE_KEY}:${encodeURIComponent(id)}` : STORAGE_KEY
}

function loadAppointments(id = accountId.value) {
  try {
    const saved = localStorage.getItem(storageKeyForAccount(id))
    if (!saved) return id ? [] : [...seedAppointments]
    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed)) throw new Error('Saved appointment data is not a list.')
    return parsed
  } catch (error) {
    console.error('Could not load saved appointments:', error)
    notice.value = 'Saved appointments could not be loaded. New changes may not persist.'
    return [...seedAppointments]
  }
}

watch(accountId, (id) => {
  appointments.value = loadAppointments(id)
  notice.value = ''
})

function saveAppointments() {
  try {
    localStorage.setItem(storageKeyForAccount(accountId.value), JSON.stringify(appointments.value))
  } catch (error) {
    console.error('Could not save appointments:', error)
    notice.value = 'Your change is visible now, but could not be saved on this device.'
  }
}

function makeAppointmentId() {
  const year = new Date().getFullYear()
  const highest = appointments.value.reduce((max, appointment) => {
    const match = appointment.id.match(/(\d+)$/)
    return match ? Math.max(max, Number(match[1])) : max
  }, 0)
  return `BA-${year}-${String(highest + 1).padStart(4, '0')}`
}

function createAppointment(details) {
  const appointmentDay = new Date(`${details.date}T00:00:00`).getDay()
  if (appointmentDay === 0 || appointmentDay === 6) {
    notice.value = 'Please choose a weekday. The barangay office is open Monday to Friday.'
    return false
  }

  const appointment = {
    ...details,
    id: makeAppointmentId(),
    resident: details.resident.trim(),
    phone: details.phone.trim(),
    notes: details.notes.trim(),
    status: 'Pending',
  }
  appointments.value.push(appointment)
  saveAppointments()
  notice.value = `Appointment request ${appointment.id} has been submitted.`
  return true
}

function updateAppointment(id, details) {
  const appointment = appointments.value.find((item) => item.id === id)
  if (!appointment) return false

  const appointmentDay = new Date(`${details.date}T00:00:00`).getDay()
  if (appointmentDay === 0 || appointmentDay === 6) {
    notice.value = 'Please choose a weekday. The barangay office is open Monday to Friday.'
    return false
  }

  Object.assign(appointment, {
    ...details,
    resident: details.resident.trim(),
    phone: details.phone.trim(),
    notes: details.notes.trim(),
  })
  saveAppointments()
  notice.value = `Appointment ${appointment.id} has been updated.`
  return true
}

function updateStatus(appointment, status) {
  appointment.status = status
  saveAppointments()
}

function deleteAppointment(appointment) {
  if (!window.confirm(`Delete appointment ${appointment.id} for ${appointment.resident}?`)) return
  appointments.value = appointments.value.filter((item) => item.id !== appointment.id)
  saveAppointments()
  notice.value = `Appointment ${appointment.id} has been deleted.`
}

function formatDate(date) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
    .format(new Date(`${date}T00:00:00`))
}

export function useAppointments() {
  return {
    notice,
    appointments,
    todayAppointments,
    pendingCount,
    confirmedCount,
    todayString,
    createAppointment,
    updateAppointment,
    updateStatus,
    deleteAppointment,
    formatDate,
  }
}
