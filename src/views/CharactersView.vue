<template>
    <div class="min-h-screen bg-gray-100">
        <!-- Navegación -->
        <nav class="bg-white shadow-md">
            <div class="container mx-auto px-6 py-4 flex items-center justify-between">
                <h1 class="text-gray-800 font-bold text-2xl">Rick & Morty</h1>
                
                <div class="flex items-center gap-3">
                    <!-- Si no está logeado, mostrar Iniciar Sesión -->
                    <router-link 
                        v-if="!estaAutenticado()"
                        to="/login" 
                        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded"
                    >
                        Iniciar Sesión
                    </router-link>
                    
                    <!-- Si está logeado, mostrar Ver Favoritos -->
                    <router-link 
                        v-else
                        to="/favoritos" 
                        class="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded"
                    >
                        Ver Favoritos
                    </router-link>
                </div>
            </div>
        </nav>

        <!-- Contenido principal -->
        <div class="container mx-auto px-6 py-10">
            <!-- Título -->
            <div class="mb-8">
                <h2 class="text-3xl font-bold text-gray-800 mb-2">Personajes</h2>
                <p class="text-gray-600">Explora y guarda tus personajes favoritos</p>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="flex justify-center items-center py-20">
                <div class="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-600"></div>
            </div>

            <!-- Grid de personajes -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <CharacterCard 
                    v-for="character in characters" 
                    :key="character.id"
                    :character="character"
                    @add-to-favorites="handleAddToFavorites"
                />
            </div>

            <!-- Paginación -->
            <div class="flex justify-center items-center gap-4 mt-10">
                <button 
                    @click="prevPage"
                    :disabled="page === 1"
                    class="bg-white hover:bg-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-800 font-semibold px-6 py-2 rounded border border-gray-300"
                >
                    Anterior
                </button>

                <span class="text-gray-700 font-semibold">
                    Página {{ page }}
                </span>

                <button 
                    @click="nextPage"
                    :disabled="!hasNextPage"
                    class="bg-white hover:bg-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-800 font-semibold px-6 py-2 rounded border border-gray-300"
                >
                    Siguiente
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { estaAutenticado, obtenerUsuario } from '@/servicios/autenticacion.js'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import axios from 'axios'
import CharacterCard from '@/components/CharacterCard.vue'

const router = useRouter()
const toast = useToast()
const db = getFirestore()

const characters = ref([])
const loading = ref(false)
const page = ref(1)
const hasNextPage = ref(true)

const fetchCharacters = async () => {
    loading.value = true
    try {
        const response = await axios.get(`https://rickandmortyapi.com/api/character?page=${page.value}`)
        characters.value = response.data.results
        hasNextPage.value = !!response.data.info.next
    } catch (error) {
        toast.error('Error al cargar personajes')
        console.error(error)
    } finally {
        loading.value = false
    }
}

const handleAddToFavorites = async (character) => {
    // Verificar si está autenticado
    if (!estaAutenticado()) {
        toast.warning('Debes iniciar sesión para añadir favoritos')
        setTimeout(() => {
            router.push('/login')
        }, 1500)
        return
    }

    const usuario = obtenerUsuario()
    
    // Verificar si el email está verificado
    if (!usuario.value.emailVerified) {
        toast.error('Debes verificar tu email antes de añadir favoritos. Revisa tu bandeja de entrada.')
        return
    }

    try {
        const favoriteRef = doc(db, 'users', usuario.value.uid, 'favorites', character.id.toString())
        await setDoc(favoriteRef, {
            id: character.id,
            name: character.name,
            status: character.status,
            species: character.species,
            type: character.type,
            gender: character.gender,
            image: character.image,
            addedAt: new Date()
        })

        toast.success(`${character.name} añadido a favoritos!`)
        
        setTimeout(() => {
            router.push('/favoritos')
        }, 1000)
    } catch (error) {
        toast.error('Error al añadir a favoritos')
        console.error(error)
    }
}

const nextPage = () => {
    if (hasNextPage.value) {
        page.value++
        fetchCharacters()
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

const prevPage = () => {
    if (page.value > 1) {
        page.value--
        fetchCharacters()
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

onMounted(() => {
    fetchCharacters()
})
</script>

<style lang="scss" scoped>

</style>
