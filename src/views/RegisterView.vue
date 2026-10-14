<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import brandMark from '../assets/brand-mark.svg'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { register } = useAuth()
const fullName = ref('')
const email = ref('')
const phone = ref('')
const address = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

async function registerResident() {
  isSubmitting.value = true
  errorMessage.value = ''
  const result = await register({
    name: fullName.value,
    email: email.value,
    phone: phone.value,
    address: address.value,
    password: password.value,
  })
  isSubmitting.value = false
  if (!result.ok) {
    errorMessage.value = result.error
    return
  }
  router.push({ name: 'login', query: { email: result.email, registered: 'true' } })
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-card">
      <RouterLink class="auth-brand" to="/"><img :src="brandMark" alt=""><span><strong>Barangay Kalinga</strong><small>Resident Portal</small></span></RouterLink>
      <div class="eyebrow"><span class="eyebrow-line"></span> JOIN YOUR COMMUNITY</div>
      <h1>Create an account</h1>
      <p class="auth-intro">Register to manage your barangay service appointments.</p>
      <form class="auth-form" @submit.prevent="registerResident">
        <label class="field-label">Full name<input v-model="fullName" type="text" autocomplete="name" placeholder="Enter your full name" required></label>
        <label class="field-label">Email address<input v-model="email" type="email" autocomplete="email" placeholder="you@example.com" required></label>
        <label class="field-label">Mobile number<input v-model="phone" type="tel" autocomplete="tel" placeholder="09XX XXX XXXX" required></label>
        <label class="field-label">Address / zone<input v-model="address" type="text" autocomplete="street-address" placeholder="e.g. Zone 3, San Isidro" required></label>
        <label class="field-label">Password<input v-model="password" type="password" autocomplete="new-password" minlength="8" placeholder="At least 8 characters" required></label>
        <button class="button button-primary auth-submit" type="submit" :disabled="isSubmitting">{{ isSubmitting ? 'Creating account…' : 'Create account' }} <span>→</span></button>
      </form>
      <p v-if="errorMessage" class="auth-error" role="alert">{{ errorMessage }}</p>
      <p class="auth-switch">Already registered? <RouterLink to="/login">Log in</RouterLink></p>
      <div class="demo-disclaimer">This creates a local prototype account on this device. The password is hashed before it is stored; no data is sent to a server.</div>
      <RouterLink class="auth-home-link" to="/">← Back to home</RouterLink>
    </section>
  </main>
</template>
