<script setup>
import { services } from '../data/services'

defineProps({
  form: {
    type: Object,
    required: true,
  },
  todayString: {
    type: String,
    required: true,
  },
})

defineEmits(['review'])
</script>

<template>
  <form class="panel booking-form" @submit.prevent="$emit('review')">
    <div class="form-section-title"><span class="form-step">01</span><div><h2>What do you need?</h2><p>Select the service you want to request.</p></div></div>
    <div class="service-select-grid">
      <label v-for="service in services" :key="service.name" class="service-option" :class="{ selected: form.service === service.name }">
        <input v-model="form.service" type="radio" name="service" :value="service.name" required>
        <span class="option-check">✓</span><span class="option-icon">{{ service.icon }}</span>
        <strong>{{ service.name }}</strong><small>{{ service.fee }} <i>·</i> {{ service.turnaround }}</small>
      </label>
    </div>

    <div class="form-section-title second-section"><span class="form-step">02</span><div><h2>Choose a date & time</h2><p>Appointments are available Monday to Friday, 8:00 AM – 4:00 PM.</p></div></div>
    <div class="form-two-col">
      <label class="field-label">Preferred date<input v-model="form.date" type="date" :min="todayString" required></label>
      <label class="field-label">Available time
        <select v-model="form.time" required>
          <option value="" disabled>Select a time</option>
          <option>08:00 AM</option><option>09:00 AM</option><option>10:00 AM</option><option>10:30 AM</option>
          <option>01:00 PM</option><option>01:30 PM</option><option>02:00 PM</option><option>03:00 PM</option>
        </select>
      </label>
    </div>

    <div class="form-section-title second-section"><span class="form-step">03</span><div><h2>Your contact details</h2><p>We'll use these details to confirm your appointment.</p></div></div>
    <div class="form-two-col">
      <label class="field-label">Full name<input v-model="form.resident" type="text" placeholder="e.g. Maria Santos" autocomplete="name" required></label>
      <label class="field-label">Mobile number<input v-model="form.phone" type="tel" placeholder="09XX XXX XXXX" autocomplete="tel" required></label>
    </div>
    <label class="field-label notes-field">Notes <span>(optional)</span><textarea v-model="form.notes" rows="3" placeholder="Anything else our staff should know?"></textarea></label>
    <div class="form-actions"><span><span class="secure-mark">✓</span> Your information is kept private and secure.</span><button class="button button-primary" type="submit">Continue <span>→</span></button></div>
  </form>
</template>
