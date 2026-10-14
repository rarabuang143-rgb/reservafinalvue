<script setup>
import { RouterLink } from 'vue-router'
import brandMark from '../assets/brand-mark.svg'
</script>

<template>
  <main class="landing-page">
    <header class="landing-nav">
      <RouterLink class="brand" to="/">
        <img class="brand-mark" :src="brandMark" alt="">
        <span class="brand-copy"><strong>Barangay</strong><small>Kalinga · Resident Portal</small></span>
      </RouterLink>
      <div class="landing-nav-links"><RouterLink to="/login">Log in</RouterLink><RouterLink class="button button-primary" to="/register">Create an account <span>→</span></RouterLink></div>
    </header>
    <section class="landing-hero">
      <div class="landing-copy">
        <div class="eyebrow"><span class="eyebrow-line"></span> YOUR BARANGAY, ONE CLICK AWAY</div>
        <h1>Public service,<br><span>made simple.</span></h1>
        <p>Book appointments, prepare your documents, and stay connected with Barangay Kalinga — all in one friendly resident portal.</p>
        <div class="landing-actions"><RouterLink class="button button-primary" to="/login">Log in to your account <span>→</span></RouterLink><RouterLink class="landing-text-link" to="/register">New here? Create an account</RouterLink></div>
        <div class="landing-proof"><span>✓</span> Convenient appointments <i>·</i> Clear requirements <i>·</i> Community first</div>
      </div>
      <div class="landing-art" aria-hidden="true">
        <div class="art-sun"></div><div class="art-building"><div class="art-roof"></div><div class="art-columns"><i></i><i></i><i></i></div><div class="art-door"></div><div class="art-sign">BARANGAY HALL</div></div>
        <div class="art-leaf leaf-one">✳</div><div class="art-leaf leaf-two">✿</div>
        <div class="art-note"><span>✦</span><div><strong>Here for you</strong><small>Serving our community</small></div></div>
      </div>
    </section>
    <section class="landing-features">
      <article><span>▤</span><strong>Book a visit</strong><p>Choose the service, date, and time that fit your schedule.</p></article>
      <article><span>◇</span><strong>Know what to bring</strong><p>Review requirements, fees, and processing times before you go.</p></article>
      <article><span>⌂</span><strong>Stay in the know</strong><p>Keep your barangay appointments organized in one place.</p></article>
    </section>
    <footer class="landing-footer">© 2026 Barangay Kalinga <span>Serving our community with care.</span></footer>
  </main>
</template>
