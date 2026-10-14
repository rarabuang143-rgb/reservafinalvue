import { reactive, ref } from 'vue'

const PROFILE_STORAGE_PREFIX = 'barangay-kalinga-profile:'
const SESSION_STORAGE_KEY = 'barangay-kalinga-session'
const accountId = ref(localStorage.getItem(SESSION_STORAGE_KEY) || '')
const profile = reactive({
  name: '',
  phone: '',
  email: '',
  username: '',
  address: '',
  barangay: 'Barangay Kalinga',
  residentSince: '',
  lastLogin: '',
})

function getDisplayName(identifier) {
  const namePart = identifier.includes('@') ? identifier.slice(0, identifier.indexOf('@')) : identifier
  return namePart
    .trim()
    .split(/[._\-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toLocaleUpperCase() + part.slice(1))
    .join(' ')
}

function loadProfile(id = accountId.value) {
  if (!id) {
    Object.assign(profile, {
      name: '',
      phone: '',
      email: '',
      username: '',
      address: '',
      barangay: 'Barangay Kalinga',
      residentSince: '',
      lastLogin: '',
    })
    return
  }
  try {
    const saved = localStorage.getItem(`${PROFILE_STORAGE_PREFIX}${id}`)
    if (!saved) return
    const parsed = JSON.parse(saved)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Saved resident profile is not an object.')
    }
    Object.assign(profile, parsed)
  } catch (error) {
    console.error('Could not load resident profile:', error)
  }
}

function saveProfile() {
  if (!accountId.value) return false
  try {
    localStorage.setItem(`${PROFILE_STORAGE_PREFIX}${accountId.value}`, JSON.stringify(profile))
    return true
  } catch (error) {
    console.error('Could not save resident profile:', error)
    return false
  }
}

export function useResidentProfile() {
  loadProfile()

  function setActiveAccount(account) {
    try {
      accountId.value = account.id
      localStorage.setItem(SESSION_STORAGE_KEY, account.id)
    } catch (error) {
      console.error('Could not save the active resident account:', error)
      accountId.value = ''
      return false
    }
    Object.assign(profile, {
      name: account.name || getDisplayName(account.email),
      phone: account.phone || '',
      email: account.email || '',
      username: account.email || '',
      address: account.address || '',
      barangay: account.barangay || 'Barangay Kalinga',
      residentSince: account.residentSince || new Date().getFullYear(),
      lastLogin: new Date().toISOString(),
    })
    return saveProfile()
  }

  function clearActiveAccount() {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY)
    } catch (error) {
      console.error('Could not clear the active resident account:', error)
    }
    accountId.value = ''
    loadProfile('')
  }

  return { profile, accountId, setActiveAccount, clearActiveAccount }
}
