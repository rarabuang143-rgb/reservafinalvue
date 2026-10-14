<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <header class="topbar">
    <div class="breadcrumb"><span>Resident portal</span><span class="crumb-divider">/</span><strong>{{ title }}</strong></div>
    <div class="topbar-actions">
      <div class="office-status"><span></span> Office open <small>· 8:00 AM – 5:00 PM</small></div>
      <button class="icon-button notification-button" aria-label="Notifications"><span>♧</span><i></i></button>
    </div>
  </header>
</template>
