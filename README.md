# Barangay Kalinga Resident Portal

A Vue 3 single-page prototype for barangay services, resident records, and appointment scheduling.

## Project structure

```text
src/
├── assets/
│   ├── brand-mark.svg
│   └── style.css
├── components/
│   ├── AppLayout.vue
│   ├── Navbar.vue
│   ├── Sidebar.vue
│   └── AppointmentForm.vue
├── views/
│   ├── HomeView.vue
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   ├── OverviewView.vue
│   ├── AppointmentsView.vue
│   ├── BookAppointmentView.vue
│   ├── ProfileView.vue
│   ├── RequirementsView.vue
│   ├── ResidentsView.vue
│   └── SettingsView.vue
├── router/
│   └── index.js
├── data/
│   └── services.js
├── composables/
│   └── useAppointments.js
├── App.vue
└── main.js
```

## Application pages

- **Landing page** — introduces the resident portal and links to login or registration.
- **Login and register** — create local resident accounts and validate login credentials. A newly registered resident starts with zero appointments. Authentication data is kept on this device; passwords are PBKDF2-hashed and are never stored as plain text or sent to a server.
- **Dashboard** — appointment statistics and shortcuts to resident services.
- **Appointments** — create, review, save, search, filter, edit, and delete appointment records.
- **Residents** — create, view, edit, and delete resident directory records.
- **Requirements** — documents project and quality requirements, outlines the Vue development process, and includes the resident service document and fee catalog.
- **Settings** — saves display and notification preferences on the current device; profile information is available from the sidebar.

Appointment records are stored separately for each logged-in account, and newly registered accounts start with an empty appointment list. Resident records and preferences use browser local storage. The prototype has no shared database or backend.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`.
