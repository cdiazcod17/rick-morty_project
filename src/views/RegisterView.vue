<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-12">
        <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <!-- Título -->
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-gray-800 mb-2">Crear Cuenta</h1>
                <p class="text-gray-600">Únete a la comunidad de Rick & Morty</p>
            </div>

            <!-- Formulario -->
            <form @submit.prevent="handleRegister" class="space-y-5">
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
                    <p class="text-xs text-gray-500 mt-1">
                        Te enviaremos un email de verificación
                    </p>
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
                        minlength="6"
                        placeholder="Mínimo 6 caracteres"
                        class="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    >
                </div>

                <!-- Confirmar Password -->
                <div>
                    <label class="block text-gray-700 font-semibold mb-2">
                        Confirmar Contraseña
                    </label>
                    <input 
                        v-model="confirmPassword"
                        type="password"
                        required
                        minlength="6"
                        placeholder="Repite tu contraseña"
                        class="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    >
                </div>

                <!-- Botón -->
                <button 
                    type="submit"
                    :disabled="loading"
                    class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded transition"
                >
                    {{ loading ? 'Creando cuenta...' : 'Crear Cuenta' }}
                </button>
            </form>

            <!-- Enlaces -->
            <div class="mt-6 text-center space-y-3">
                <p class="text-gray-600">
                    ¿Ya tienes cuenta? 
                    <router-link to="/login" class="text-blue-600 hover:text-blue-700 font-semibold">
                        Inicia sesión
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
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'

const router = useRouter()
const toast = useToast()
const auth = getAuth()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const handleRegister = async () => {
    if (password.value !== confirmPassword.value) {
        toast.error('Las contraseñas no coinciden')
        return
    }

    if (password.value.length < 6) {
        toast.error('La contraseña debe tener al menos 6 caracteres')
        return
    }

    loading.value = true
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
        await sendEmailVerification(userCredential.user)
        
        toast.success('¡Cuenta creada! Revisa tu email para verificar tu cuenta antes de usar favoritos', {
            timeout: 6000
        })
        
        setTimeout(() => {
            router.push('/favoritos')
        }, 2000)
    } catch (error) {
        console.error(error)
        if (error.code === 'auth/email-already-in-use') {
            toast.error('Este email ya está registrado')
        } else if (error.code === 'auth/invalid-email') {
            toast.error('Email inválido')
        } else if (error.code === 'auth/weak-password') {
            toast.error('Contraseña muy débil')
        } else {
            toast.error('Error al crear la cuenta')
        }
    } finally {
        loading.value = false
    }
}
</script>

<style lang="scss" scoped>

</style>
