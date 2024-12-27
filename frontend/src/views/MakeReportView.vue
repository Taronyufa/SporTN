<template>
    <div class="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Report Form -->
        <div class="bg-white shadow-md rounded-lg p-4">
            <h1 class="text-2xl font-bold mb-4">Invia una Segnalazione</h1>
            <form @submit.prevent="submitReport">
            <!-- Title -->
            <div class="mb-4">
                <label for="title" class="block text-gray-700 font-medium mb-2">Titolo</label>
                <input
                id="title"
                v-model="title"
                type="text"
                placeholder="Inserisci il titolo della segnalazione"
                class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
            </div>
    
            <!-- Description -->
            <div class="mb-4">
                <label for="description" class="block text-gray-700 font-medium mb-2">Descrizione</label>
                <textarea
                id="description"
                v-model="description"
                placeholder="Descrivi il problema che hai riscontrato"
                rows="4"
                class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                ></textarea>
            </div>
    
            <!-- Submit Button -->
            <button
                type="submit"
                class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
                Invia Segnalazione
            </button>
            </form>
        </div>
    
        <!-- Field Details -->
        <div class="bg-white shadow-md rounded-lg p-4">
            <h1 class="text-2xl font-bold mb-4">Dettagli del Campo</h1>
            <img
            :src="field.foto_url"
            :alt="field.nome"
            class="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p class="text-gray-600 mb-2"><strong>Nome:</strong> {{ field.nome }}</p>
            <p class="text-gray-600 mb-2"><strong>Indirizzo:</strong> {{ field.indirizzo }}</p>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import user from '../states/user';
    
    const route = useRoute();
    const router = useRouter();
    
    var field = ref({});
    const title = ref('');
    const description = ref('');
    
    async function fetchFieldDetails(fieldId) {
        try {
            const response = await fetch(`http://localhost:3000/api/fields/${fieldId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch field details.');
            }
        
            field = await response.json();
        } catch (error) {
            console.error('Error fetching field details:', error);
            router.push('/fields'); // Redirect to fields page if unable to fetch
        }
    }
    
    async function submitReport() {
        if (!user.token) {
            alert('You need to be logged in to submit a report.');
            router.push('/login');
            return;
        }
    
        if (!title.value || !description.value) {
            alert('Please fill in all fields.');
            return;
        }
    
        try {
            console.log(
                {
                    field_id: field._id,
                    name: title.value,
                    description: description.value,
                }
            )

            const response = await fetch(`http://localhost:3000/api/reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    field_id: field._id,
                    name: title.value,
                    description: description.value,
                }),
            });
        
            if (!response.ok) {
                throw new Error('Failed to submit report.');
            }
        
            alert('Report submitted successfully!');
            router.push(`/my-bookings`);
        } catch (error) {
            console.error('Error submitting report:', error);
        }
    }
    
    onMounted(() => {
        if (!user.token) {
        alert('You need to be logged in to access this page.');
        router.push('/login');
        return;
        }
    
        const fieldId = route.params.id;
        fetchFieldDetails(fieldId);

        document.title = 'SporTN - Invia Segnalazione';
    });
</script>
