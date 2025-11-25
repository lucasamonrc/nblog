import { createApp } from 'vue'
import App from './App.vue'

// Register service worker for background notifications
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('[App] Service worker registered:', registration)
    })
    .catch(error => {
      console.warn('[App] Service worker registration failed:', error)
    })
}

createApp(App).mount('#app')
