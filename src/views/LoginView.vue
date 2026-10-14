<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import brandMark from '../assets/brand-mark.svg'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const route = useRoute()
const { login } = useAuth()
const email = ref(typeof route.query.email === 'string' ? route.query.email : '')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

async function signIn() {
  isSubmitting.value = true
  errorMessage.value = ''
  const result = await login({ email: email.value, password: password.value })
  isSubmitting.value = false
  if (!result.ok) {
    errorMessage.value = result.error
    return
  }
  if (typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/app/')) {
    router.push(route.query.redirect)
  } else {
    router.push({ name: 'dashboard' })
  }
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-card">
      <RouterLink class="auth-brand" to="/"><img :src="brandMark" alt=""><span><strong>Barangay Kalinga</strong><small>Resident Portal</small></span></RouterLink>
      <div class="eyebrow"><span class="eyebrow-line"></span> WELCOME BACK</div>
      <h1>Log in to your account</h1>
      <p class="auth-intro">Access your appointments and barangay services.</p>
      <p v-if="route.query.registered === 'true'" class="auth-success" role="status">Account created. Log in with your email and password to continue.</p>
      <form class="auth-form" @submit.prevent="signIn">
        <label class="field-label">Email address<input v-model="email" type="email" autocomplete="email" placeholder="Enter your account email" required></label>
        <label class="field-label">Password<input v-model="password" type="password" autocomplete="current-password" placeholder="Enter your password" required></label>
        <button class="button button-primary auth-submit" type="submit" :disabled="isSubmitting">{{ isSubmitting ? 'Logging in…' : 'Log in' }} <span>→</span></button>
      </form>
      <p v-if="errorMessage" class="auth-error" role="alert">{{ errorMessage }}</p>
      <p class="auth-switch">Don't have an account? <RouterLink to="/register">Create one</RouterLink></p>
      <div class="demo-disclaimer">Accounts are stored on this device for this prototype. Passwords are hashed before storage and are never saved as plain text or sent to a server.</div>
      <RouterLink class="auth-home-link" to="/">← Back to home</RouterLink>
    </section>
  </main>
</template>
