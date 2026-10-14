import { useResidentProfile } from './useResidentProfile'

const ACCOUNTS_STORAGE_KEY = 'barangay-kalinga-accounts'
const HASH_ITERATIONS = 210_000

function encodeBase64(bytes) {
  return btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(''))
}

function decodeBase64(value) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0))
}

async function hashPassword(password, salt) {
  if (!globalThis.crypto?.subtle) throw new Error('Secure password hashing is unavailable in this browser.')
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: HASH_ITERATIONS },
    key,
    256,
  )
  return new Uint8Array(hash)
}

function loadAccounts() {
  const saved = localStorage.getItem(ACCOUNTS_STORAGE_KEY)
  if (!saved) return []
  const accounts = JSON.parse(saved)
  if (!Array.isArray(accounts)) throw new Error('Saved accounts are not a list.')
  return accounts
}

function getAccountId(email) {
  return email.trim().toLowerCase()
}

export function useAuth() {
  const { setActiveAccount, clearActiveAccount } = useResidentProfile()

  async function register({ name, email, phone, address, password }) {
    try {
      const accounts = loadAccounts()
      const normalizedEmail = getAccountId(email)
      if (accounts.some((account) => account.id === normalizedEmail)) {
        return { ok: false, error: 'An account with this email already exists. Please log in instead.' }
      }

      const salt = crypto.getRandomValues(new Uint8Array(16))
      const passwordHash = await hashPassword(password, salt)
      const account = {
        id: normalizedEmail,
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        address: address.trim(),
        barangay: 'Barangay Kalinga',
        residentSince: new Date().getFullYear(),
        salt: encodeBase64(salt),
        passwordHash: encodeBase64(passwordHash),
      }
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify([...accounts, account]))
      return { ok: true, email: normalizedEmail }
    } catch (error) {
      console.error('Could not create resident account:', error)
      return { ok: false, error: error instanceof Error ? error.message : 'Could not create the account on this device.' }
    }
  }

  async function login({ email, password }) {
    try {
      const normalizedEmail = getAccountId(email)
      const account = loadAccounts().find((item) => item.id === normalizedEmail)
      if (!account) return { ok: false, error: 'No account was found for that email. Create an account first.' }

      const candidateHash = await hashPassword(password, decodeBase64(account.salt))
      const savedHash = decodeBase64(account.passwordHash)
      const isValid = candidateHash.length === savedHash.length &&
        candidateHash.every((byte, index) => byte === savedHash[index])
      if (!isValid) return { ok: false, error: 'The email or password is incorrect.' }

      if (!setActiveAccount({
        id: account.id,
        name: account.name,
        email: account.email,
        phone: account.phone,
        address: account.address,
        barangay: account.barangay,
        residentSince: account.residentSince,
      })) {
        return { ok: false, error: 'Login succeeded, but the profile could not be saved in this browser.' }
      }
      return { ok: true }
    } catch (error) {
      console.error('Could not log in resident:', error)
      return { ok: false, error: error instanceof Error ? error.message : 'Could not log in on this device.' }
    }
  }

  return { register, login, logout: clearActiveAccount }
}
