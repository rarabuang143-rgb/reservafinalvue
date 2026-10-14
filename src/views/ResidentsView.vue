<script setup>
import { computed, onMounted, reactive, ref } from 'vue'

const STORAGE_KEY = 'barangay-kalinga-residents'
const initialResidents = [
  { id: 'RES-001', name: 'Maria Santos', phone: '0917 555 0142', address: 'Zone 3, San Isidro', status: 'Verified' },
  { id: 'RES-002', name: 'Juan Dela Cruz', phone: '0928 310 8821', address: 'Zone 2, San Isidro', status: 'Verified' },
  { id: 'RES-003', name: 'Angela Reyes', phone: '0995 321 0064', address: 'Zone 1, San Isidro', status: 'For review' },
]
const residents = ref([...initialResidents])
const search = ref('')
const dialogOpen = ref(false)
const editingId = ref(null)
const notice = ref('')
const form = reactive({ name: '', phone: '', address: '' })
const filteredResidents = computed(() => {
  const query = search.value.trim().toLowerCase()
  return residents.value.filter((resident) => (
    !query ||
    resident.name.toLowerCase().includes(query) ||
    resident.id.toLowerCase().includes(query) ||
    resident.address.toLowerCase().includes(query)
  ))
})

onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (!Array.isArray(parsed)) throw new Error('Saved resident data is not a list.')
      residents.value = parsed
    }
  } catch (error) {
    console.error('Could not load resident records:', error)
    notice.value = 'Resident records could not be loaded from this device.'
  }
})

function saveResidents() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(residents.value))
  } catch (error) {
    console.error('Could not save resident records:', error)
    notice.value = 'Your change is visible now, but could not be saved on this device.'
  }
}

function openForm(resident = null) {
  editingId.value = resident?.id || null
  Object.assign(form, resident ? {
    name: resident.name,
    phone: resident.phone,
    address: resident.address,
  } : { name: '', phone: '', address: '' })
  dialogOpen.value = true
}

function saveResident() {
  if (editingId.value) {
    const resident = residents.value.find((item) => item.id === editingId.value)
    if (resident) Object.assign(resident, { ...form, name: form.name.trim(), phone: form.phone.trim(), address: form.address.trim() })
    notice.value = 'Resident details updated.'
  } else {
    const nextNumber = residents.value.reduce((max, item) => {
      const number = Number(item.id.split('-')[1])
      return Number.isFinite(number) ? Math.max(max, number) : max
    }, 0) + 1
    residents.value.push({
      id: `RES-${String(nextNumber).padStart(3, '0')}`,
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      status: 'For review',
    })
    notice.value = 'Resident record added.'
  }
  saveResidents()
  dialogOpen.value = false
}

function deleteResident(resident) {
  if (!window.confirm(`Delete resident record for ${resident.name}?`)) return
  residents.value = residents.value.filter((item) => item.id !== resident.id)
  saveResidents()
  notice.value = 'Resident record deleted.'
}
</script>

<template>
  <section v-if="notice" class="notice" role="status"><span>{{ notice }}</span><button aria-label="Dismiss notification" @click="notice = ''">×</button></section>
  <section class="page-heading records-heading">
    <div><div class="eyebrow"><span class="eyebrow-line"></span> COMMUNITY DIRECTORY</div><h1>Residents</h1><p class="welcome-subtitle">Manage resident contact and address records.</p></div>
    <button class="button button-primary" @click="openForm()"><span>＋</span> Add resident</button>
  </section>
  <section class="record-summary residents-summary">
    <div><span class="summary-label">Resident records</span><strong>{{ residents.length }}</strong></div>
    <div><span class="summary-label"><i class="mini-dot green"></i> Verified</span><strong>{{ residents.filter((item) => item.status === 'Verified').length }}</strong></div>
    <div><span class="summary-label"><i class="mini-dot amber"></i> For review</span><strong>{{ residents.filter((item) => item.status !== 'Verified').length }}</strong></div>
  </section>
  <section class="panel records-panel">
    <div class="records-toolbar">
      <div><h2>Resident directory</h2><p>Update or remove a resident record.</p></div>
      <label class="search-field resident-search"><span>⌕</span><input v-model="search" type="search" placeholder="Search residents"></label>
    </div>
    <div class="table-wrap">
      <table class="resident-table">
        <thead><tr><th>RESIDENT</th><th>CONTACT</th><th>ADDRESS</th><th>STATUS</th><th><span class="sr-only">Actions</span></th></tr></thead>
        <tbody>
          <tr v-for="resident in filteredResidents" :key="resident.id">
            <td><div class="resident-cell"><span class="table-avatar">{{ resident.name.split(' ').map((part) => part[0]).slice(0, 2).join('') }}</span><span><strong>{{ resident.name }}</strong><small>{{ resident.id }}</small></span></div></td>
            <td>{{ resident.phone }}</td><td>{{ resident.address }}</td>
            <td><span class="resident-status" :class="{ verified: resident.status === 'Verified' }">{{ resident.status }}</span></td>
            <td><div class="action-buttons"><button aria-label="Edit resident" title="Edit" @click="openForm(resident)">✎</button><button aria-label="Delete resident" title="Delete" @click="deleteResident(resident)">×</button></div></td>
          </tr>
          <tr v-if="filteredResidents.length === 0"><td colspan="5"><div class="empty-state"><span>⌕</span><strong>No residents found</strong><p>Try another search or add a new resident.</p></div></td></tr>
        </tbody>
      </table>
    </div>
    <div class="table-footer"><span>Showing <strong>{{ filteredResidents.length }}</strong> of <strong>{{ residents.length }}</strong> residents</span><span>Records are saved on this device <b>✓</b></span></div>
  </section>

  <div v-if="dialogOpen" class="modal-backdrop" @click.self="dialogOpen = false">
    <form class="modal-card" @submit.prevent="saveResident">
      <div class="modal-heading"><div><div class="eyebrow"><span class="eyebrow-line"></span> RESIDENT DIRECTORY</div><h2>{{ editingId ? 'Edit resident' : 'Add resident' }}</h2></div><button type="button" class="modal-close" aria-label="Close dialog" @click="dialogOpen = false">×</button></div>
      <p class="modal-description">Resident records are stored locally in this demo.</p>
      <label class="field-label">Full name<input v-model="form.name" type="text" required></label>
      <label class="field-label">Mobile number<input v-model="form.phone" type="tel" required></label>
      <label class="field-label">Address / zone<input v-model="form.address" type="text" required></label>
      <div class="modal-actions"><button type="button" class="button button-outline" @click="dialogOpen = false">Cancel</button><button type="submit" class="button button-primary">Save resident <span>✓</span></button></div>
    </form>
  </div>
</template>
