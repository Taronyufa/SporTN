<template>
    <div class="container mx-auto p-6">
        <h1 class="text-3xl font-bold text-center mb-6">Dettagli Segnalazione</h1>
    
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Report Details -->
            <div class="bg-white shadow-md rounded-lg p-4 mb-6">
                <h2 class="text-2xl font-bold mb-4">Dettagli della Segnalazione</h2>
                <p class="text-gray-600 mb-2"><strong>Titolo:</strong> {{ report.titolo }}</p>
                <p class="text-gray-600 mb-2"><strong>Descrizione:</strong> {{ report.testo }}</p>
                <p class="text-gray-600 mb-2"><strong>Inviata da:</strong> {{ report.email_utente }}</p>
                <p class="text-gray-600 mb-2"><strong>Stato:</strong> {{ report.status }}</p>
            </div>
            
            <!-- Field Details -->
            <div class="bg-white shadow-md rounded-lg p-4 mb-6">
                <h2 class="text-2xl font-bold mb-4">Dettagli del Campo</h2>
                <img
                :src="field.foto_url"
                :alt="field.nome"
                class="w-full h-48 object-cover rounded-lg mb-4"
                />
                <p class="text-gray-600 mb-2"><strong>Nome:</strong> {{ field.nome }}</p>
                <p class="text-gray-600 mb-2"><strong>Indirizzo:</strong> {{ field.indirizzo }}</p>
            </div>
        </div>

        <!-- Change Report Status -->
        <div class="bg-white shadow-md rounded-lg p-4">
            <h2 class="text-2xl font-bold mb-4">Cambia Stato della Segnalazione</h2>
            <form @submit.prevent="updateStatus">
            <label for="status" class="block text-gray-700 font-medium mb-2">Stato</label>
            <textarea
                    id="status"
                    v-model="status"
                    placeholder="Inserisci il nuovo stato della segnalazione"
                    rows="2"
                    class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    ></textarea>
            <button
                type="submit"
                class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
                Aggiorna Stato
            </button>
            </form>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import user  from '../states/user';
    
    const route = useRoute();
    const router = useRouter();
    
    const report = ref({});
    const field = ref({});
    const status = ref('');
    
    async function fetchReportDetails(reportId) {
        try {
            const response = await fetch(`http://localhost:3000/api/reports/${reportId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch report details.');
            }
            const data = await response.json();
            report.value = data;
            status.value = data.status;
        
            // Fetch field details
            fetchFieldDetails(data.id_campo);
        } catch (error) {
            console.error('Error fetching report details:', error);
            router.push('/reports'); // Redirect to reports list if unable to fetch
        }
    }
    
    async function fetchFieldDetails(fieldId) {
        try {
            const response = await fetch(`http://localhost:3000/api/fields/${fieldId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch field details.');
            }
            field.value = await response.json();
        } catch (error) {
            console.error('Error fetching field details:', error);
        }
    }
    
    async function updateStatus() {
        try {
            const response = await fetch(`http://localhost:3000/api/reports/${report.value._id}/status`, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ status: status.value }),
            });
        
            if (!response.ok) {
                throw new Error('Failed to update report status.');
            }
        
            alert('Status updated successfully!');
            // refresh report details
            fetchReportDetails(report.value._id);
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status. Please try again.');
        }
    }
    
    onMounted(() => {
        const reportId = route.params.id;
        fetchReportDetails(reportId);
    });
</script>
