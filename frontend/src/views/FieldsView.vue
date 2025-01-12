<template>
    <div class="container mx-auto p-6">
        <h1 class="text-4xl font-bold text-center mb-6">Tutti i Campi</h1>

        <!-- Fields List -->
        <div v-for="field in fields" :key="field.id" class="flex flex-col md:flex-row items-center bg-white shadow-md rounded-lg mb-6 p-4">
            <!-- Field Information -->
            <div class="flex-1 md:pr-4">
                <h2 class="text-2xl font-bold mb-2">{{ field.nome }}</h2>
                <p class="text-gray-600 mb-2">Indirizzo: {{ field.indirizzo }}</p>
                <p class="text-gray-600 mb-2">Disponibile: 
                    <span :class="field.disponibile ? 'text-green-600' : 'text-red-600'">
                    {{ field.disponibile ? 'Si' : 'No' }}
                    </span>
                </p>
                <p class="text-gray-600">Sport supportati: {{ field.sport_supportati.join(', ') }}</p>

                <!-- Reserve Button -->
                <button 
                    v-if="field.disponibile"
                    @click="navigateToReservation(field._id)"
                    class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition mt-4"
                >
                    Prenota Questo Campo
                </button>
            </div>

            <!-- Field Picture -->
            <div class="w-full md:w-1/3 mt-4 md:mt-0">
            <img 
                :src="field.foto_url" 
                :alt="field.name" 
                class="w-full h-48 object-cover rounded-lg"
            />
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';

    const API_URL = import.meta.env.VITE_API_HOST;

    const fields = ref([]);
    const router = useRouter();

    async function fetchFields() {
        try {
            const response = await fetch(API_URL + '/fields');
            if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            }
            fields.value = await response.json();
        } catch (error) {
            console.error('Error fetching fields:', error);
        }
    }

    function navigateToReservation(fieldId) {
        router.push(`/book-field/${fieldId}`);
    }

    onMounted(() => {
        fetchFields();
        document.title = 'SporTN - Tutti i Campi';
    });
</script>
