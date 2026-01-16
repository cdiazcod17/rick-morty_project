<template>
    <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        <!-- Imagen -->
        <div class="relative">
            <img 
                :src="character.image" 
                :alt="character.name" 
                class="w-full h-64 object-cover"
            >
            <!-- Badge de estado -->
            <span 
                :class="statusClass" 
                class="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white"
            >
                {{ character.status }}
            </span>
        </div>

        <!-- Contenido -->
        <div class="p-5">
            <!-- Nombre -->
            <h3 class="text-xl font-bold text-gray-800 mb-3">
                {{ character.name }}
            </h3>

            <!-- Información -->
            <div class="space-y-2 mb-4 text-sm text-gray-600">
                <div class="flex justify-between">
                    <span class="font-semibold">Especie:</span>
                    <span>{{ character.species }}</span>
                </div>

                <div class="flex justify-between">
                    <span class="font-semibold">Género:</span>
                    <span>{{ character.gender }}</span>
                </div>
            </div>

            <!-- Botón -->
            <button 
                @click="addToFavorites"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
            >
                Añadir a Favoritos
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    character: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['add-to-favorites'])

const statusClass = computed(() => {
    switch(props.character.status.toLowerCase()) {
        case 'alive':
            return 'bg-green-500'
        case 'dead':
            return 'bg-red-500'
        default:
            return 'bg-gray-500'
    }
})

const addToFavorites = () => {
    emit('add-to-favorites', props.character)
}
</script>

<style lang="scss" scoped>

</style>
