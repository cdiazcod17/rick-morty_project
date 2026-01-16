import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { onAuthStateChanged } from 'firebase/auth'
import './style.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
//los imports activan la funcion onAuthStateChanged
//Significa que desde el principio se estara escuchando si hay un usuario logeado o no
import '@/firebase/config.js'
import '@/servicios/autentication.js'
import { auth } from '@/firebase/config.js'


let app

onAuthStateChanged(auth, () => {
    if (!app) {
        app = createApp(App)
        app.use(router)
        app.use(Toast, {
            position: 'top-center',
            timeout: 2000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: false,
            closeButton: 'button',
            icon: true,
            rtl: false
        })
        app.mount('#app')
    }

})
