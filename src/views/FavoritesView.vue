<template>
    <div class="min-h-screen bg-gray-100">
        <!-- Navegación -->
        <nav class="bg-white shadow-md">
            <div class="container mx-auto px-6 py-4 flex items-center justify-between">
                <h1 class="text-gray-800 font-bold text-2xl">Mis Favoritos</h1>
                <div class="flex items-center gap-3">
                    <router-link 
                        to="/" 
                        class="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-5 py-2 rounded"
                    >
                        Ver Personajes
                    </router-link>
                    <button 
                        @click="handleLogout"
                        class="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </nav>

        <!-- Contenido principal -->
        <div class="container mx-auto px-6 py-10">
            <!-- Alerta de email no verificado -->
            <div v-if="user && !user.emailVerified" class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8 rounded">
                <p class="font-semibold">⚠️ Email no verificado</p>
                <p class="text-sm">Debes verificar tu email antes de poder gestionar favoritos. Revisa tu bandeja de entrada.</p>
                <button 
                    @click="resendVerification"
                    :disabled="resendLoading"
                    class="mt-2 text-sm underline hover:no-underline"
                >
                    {{ resendLoading ? 'Enviando...' : 'Reenviar email de verificación' }}
                </button>
            </div>

            <!-- Mensaje de bienvenida -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">
                    Hola, {{ userEmail }}
                </h2>
                <p class="text-gray-600">
                    Tienes {{ favorites.length }} personaje(s) en favoritos
                </p>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="flex justify-center items-center py-20">
                <div class="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-600"></div>
            </div>

            <!-- Lista vacía -->
            <div v-else-if="favorites.length === 0" class="text-center py-20">
                <h3 class="text-2xl font-bold text-gray-800 mb-4">No tienes favoritos aún</h3>
                <p class="text-gray-600 mb-6">Explora los personajes y añade tus favoritos</p>
                <router-link 
                    to="/" 
                    class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded"
                >
                    Explorar Personajes
                </router-link>
            </div>

            <!-- Grid de favoritos -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div 
                    v-for="character in favorites" 
                    :key="character.id"
                    class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                    <!-- Imagen -->
                    <div class="relative">
                        <img 
                            :src="character.image" 
                            :alt="character.name" 
                            class="w-full h-64 object-cover"
                        >
                        <span 
                            :class="getStatusClass(character.status)" 
                            class="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white"
                        >
                            {{ character.status }}
                        </span>
                    </div>

                    <!-- Contenido -->
                    <div class="p-5">
                        <h3 class="text-xl font-bold text-gray-800 mb-3">
                            {{ character.name }}
                        </h3>

                        <div class="space-y-2 mb-4 text-sm text-gray-600">
                            <div class="flex justify-between">
                                <span class="font-semibold">Especie:</span>
                                <span>{{ character.species }}</span>
                            </div>

                            <div v-if="character.type" class="flex justify-between">
                                <span class="font-semibold">Tipo:</span>
                                <span>{{ character.type }}</span>
                            </div>

                            <div class="flex justify-between">
                                <span class="font-semibold">Género:</span>
                                <span>{{ character.gender }}</span>
                            </div>
                        </div>

                        <!-- Botón eliminar -->
                        <button 
                            @click="removeFavorite(character.id)"
                            class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { getAuth, signOut, sendEmailVerification } from 'firebase/auth'
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore'

const router = useRouter()
const toast = useToast()
const auth = getAuth()
const db = getFirestore()

const favorites = ref([])
const loading = ref(false)
const resendLoading = ref(false)
const user = ref(null)

const userEmail = computed(() => user.value?.email || '')

const loadFavorites = async () => {
    const currentUser = auth.currentUser
    
    if (!currentUser) {
        router.push('/login')
        return
    }

    user.value = currentUser

    // Si el email no está verificado, no cargar favoritos
    if (!currentUser.emailVerified) {
        loading.value = false
        return
    }

    loading.value = true
    try {
        const favoritesRef = collection(db, 'users', currentUser.uid, 'favorites')
        const snapshot = await getDocs(favoritesRef)
        favorites.value = snapshot.docs.map(doc => ({
            ...doc.data(),
            docId: doc.id
        }))
    } catch (error) {
        console.error(error)
        toast.error('Error al cargar favoritos')
    } finally {
        loading.value = false
    }
}

const removeFavorite = async (characterId) => {
    const currentUser = auth.currentUser
    if (!currentUser || !currentUser.emailVerified) {
        toast.error('Debes verificar tu email primero')
        return
    }

    try {
        await deleteDoc(doc(db, 'users', currentUser.uid, 'favorites', characterId.toString()))
        favorites.value = favorites.value.filter(fav => fav.id !== characterId)
        toast.success('Eliminado de favoritos')
    } catch (error) {
        console.error(error)
        toast.error('Error al eliminar')
    }
}

const resendVerification = async () => {
    resendLoading.value = true
    try {
        await sendEmailVerification(auth.currentUser)
        toast.success('Email de verificación enviado. Revisa tu bandeja de entrada.')
    } catch (error) {
        console.error(error)
        toast.error('Error al enviar el email')
    } finally {
        resendLoading.value = false
    }
}

const handleLogout = async () => {
    try {
        await signOut(auth)
        toast.success('Sesión cerrada')
        router.push('/')
    } catch (error) {
        console.error(error)
        toast.error('Error al cerrar sesión')
    }
}

const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
        case 'alive': return 'bg-green-500'
        case 'dead': return 'bg-red-500'
        default: return 'bg-gray-500'
    }
}

onMounted(() => {
    loadFavorites()
})
</script>

<style lang="scss" scoped>

</style>
