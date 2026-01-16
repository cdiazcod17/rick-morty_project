<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center px-6">
        <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <!-- Título -->
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-gray-800 mb-2">Iniciar Sesión</h1>
                <p class="text-gray-600">Accede a tu cuenta de Rick & Morty</p>
            </div>

            <!-- Formulario -->
            <form @submit.prevent="handleLogin" class="space-y-5">
                <!-- Email -->
                <div>
                    <label class="block text-gray-700 font-semibold mb-2">
                        Email
                    </label>
                    <input 
                        v-model="email"
                        type="email"
                        required
                        placeholder="tu@email.com"
                        class="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    >
                </div>

                <!-- Password -->
                <div>
                    <label class="block text-gray-700 font-semibold mb-2">
                        Contraseña
                    </label>
                    <input 
                        v-model="password"
                        type="password"
                        required
                        placeholder="••••••••"
                        class="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    >
                </div>

                <!-- Botón -->
                <button 
                    type="submit"
                    :disabled="loading"
                    class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded transition"
                >
                    {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
                </button>
            </form>

            <!-- Enlaces -->
            <div class="mt-6 text-center space-y-3">
                <p class="text-gray-600">
                    ¿No tienes cuenta? 
                    <router-link to="/register" class="text-blue-600 hover:text-blue-700 font-semibold">
                        Regístrate
                    </router-link>
                </p>
                <router-link to="/" class="block text-gray-500 hover:text-gray-700">
                    ← Volver a personajes
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const router = useRouter()
const toast = useToast()
const auth = getAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
    loading.value = true
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
        
        // Verificar si el email está verificado
        if (!userCredential.user.emailVerified) {
            toast.warning('Tu email aún no está verificado. Revisa tu bandeja de entrada.')
            // Aún así permitir ver personajes pero no favoritos
        } else {
            toast.success('¡Bienvenido de vuelta!')
        }
        
        router.push('/favoritos')
    } catch (error) {
        console.error(error)
        if (error.code === 'auth/invalid-credential') {
            toast.error('Email o contraseña incorrectos')
        } else if (error.code === 'auth/user-not-found') {
            toast.error('Usuario no encontrado')
        } else if (error.code === 'auth/wrong-password') {
            toast.error('Contraseña incorrecta')
        } else {
            toast.error('Error al iniciar sesión')
        }
    } finally {
        loading.value = false
    }
}
</script>

<style lang="scss" scoped>

</style>
