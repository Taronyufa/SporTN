<template>
    <div class="container mx-auto p-6">
        <h1 class="text-3xl font-bold text-center mb-6">Tutti le segnalazioni</h1>
    
        <!-- Reports List -->
        <div v-if="reports.length" class="bg-white shadow-md rounded-lg p-4">
            <div v-for="report in reports" :key="report.id" class="flex items-center justify-between border-b py-4">
            <!-- Report Details -->
            <div>
                <h2 class="text-xl font-bold">{{ report.titolo }}</h2>
                <p class="text-gray-600">Campo: {{ report.nome_campo }}</p>
                <p class="text-gray-600">Segnalazione inviata da: {{ report.email_utente }}</p>
                <p class="text-gray-600">Data e ora: {{ formatDateTime(report.data) }}</p>
                <p class="text-gray-600">Stato: {{ report.status }}</p>
            </div>
    
            <!-- View Details Button -->
            <router-link
                :to="`/reports/${report._id}`"
                class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
                Maggiori dettagli
            </router-link>
            </div>
        </div>
        
        <!-- No Reports Message -->
        <p v-else class="text-center text-gray-500">Non ci sono segnalazioni da visualizzare.</p>
    </div>
</template>
  
<script setup>
    import { ref, onMounted } from 'vue';
    import { format } from 'date-fns';
    import user  from '../states/user';
    
    const API_URL = import.meta.env.VITE_API_HOST;

    const reports = ref([]); // Store all reports
    
    async function fetchReports() {
        try {
            const response = await fetch(API_URL + '/reports', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch reports: ${response.status}`);
            }
        
            reports.value = await response.json();
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    }

    function formatDateTime(dateTimeString) {
        return format(new Date(dateTimeString), 'dd/MM/yyyy HH:mm');
    }
    
    onMounted(() => {
        fetchReports();
    });
</script>
  