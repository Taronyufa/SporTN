<template>
    <div class="container mx-auto p-6">
        <h1 class="text-3xl font-bold text-center mb-6">Profile</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- User Details -->
            <div class="bg-white shadow-md rounded-lg p-4">
                <h2 class="text-2xl font-bold mb-4">Dettagli del tuo profilo</h2>
                <p class="text-gray-600 mb-2"><strong>Username:</strong> {{ userDetails.username }}</p>
                <p class="text-gray-600 mb-2"><strong>Email:</strong> {{ userDetails.email }}</p>
                <p class="text-gray-600 mb-2">
                    <strong>Sport preferiti: </strong>
                    <span v-if="userDetails.favoriteSports">
                        {{ userDetails.favoriteSports.join(', ') }}
                    </span>
                    <span v-else>Nessuno sport preferito</span>
                </p>
                <p class="text-gray-600 mb-2">
                    <strong>Posizione preferita: </strong>
                    {{ userDetails.preferredLocation || 'Non specificata' }}
                </p>

                <!-- log out button -->
                <button
                    @click="logout"
                    class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                > 
                    Logout
                </button>
            </div>
            
            <!-- Update User Details Form -->
            <div class="bg-white shadow-md rounded-lg p-4">
                <h2 class="text-2xl font-bold mb-4">Aggiorna le tue informazioni</h2>
                <form @submit.prevent="updateUserDetails">
                    <!-- Username -->
                    <div class="mb-4">
                        <label for="username" class="block text-gray-700 font-medium mb-2">Username</label>
                        <input
                            id="username"
                            v-model="username"
                            type="text"
                            placeholder="Enter your username"
                            class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
        
                    <!-- Email -->
                    <div class="mb-4">
                        <label for="email" class="block text-gray-700 font-medium mb-2">Email</label>
                        <input
                            id="email"
                            v-model="email"
                            type="email"
                            placeholder="Enter your email"
                            class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
        
                    <!-- Favorite Sports -->
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Sport preferiti</label>
                        <div v-for="sport in sports" :key="sport" class="flex items-center mb-2">
                            <!-- if the user has the sport in their favorite sports, check the checkbox -->
                            <input
                                type="checkbox"
                                :id=sport.nome
                                :value="sport"
                                v-model="favoriteSports"
                                class="mr-2"
                            />
                            <label :for=sport.nome>{{ sport.nome }}</label>
                        </div>
                    </div>
        
                    <!-- Preferred Location -->
                    <div class="mb-4">
                        <label for="preferredLocation" class="block text-gray-700 font-medium mb-2">Posizione preferita</label>
                        <input
                            id="preferredLocation"
                            v-model="preferredLocation"
                            type="text"
                            placeholder="Inserisci la tua posizione preferita"
                            class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
        
                    <!-- Submit Button -->
                    <button
                        type="submit"
                        class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        Salva modifiche
                    </button>
                </form>
            </div>
    
            <!-- Change Password Form -->
            <div class="bg-white shadow-md rounded-lg p-4 col-span-1 md:col-span-2">
                <h2 class="text-2xl font-bold mb-4">Cambia Password</h2>
                <form @submit.prevent="changePassword">
                    <!-- Old Password -->
                    <div class="mb-4">
                    <label for="oldPassword" class="block text-gray-700 font-medium mb-2">Vecchia password</label>
                    <input
                        id="oldPassword"
                        v-model="oldPassword"
                        type="password"
                        placeholder="Inserisci la tua vecchia password"
                        class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    </div>
        
                    <!-- New Password -->
                    <div class="mb-4">
                    <label for="newPassword" class="block text-gray-700 font-medium mb-2">Nuova password</label>
                    <input
                        id="newPassword"
                        v-model="newPassword"
                        type="password"
                        placeholder="Inserisci la tua nuova password"
                        class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    </div>
        
                    <!-- Confirm New Password -->
                    <div class="mb-4">
                    <label for="confirmPassword" class="block text-gray-700 font-medium mb-2">Conferma nuova password</label>
                    <input
                        id="confirmPassword"
                        v-model="confirmPassword"
                        type="password"
                        placeholder="Conferma la tua nuova password"
                        class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    </div>
        
                    <!-- Submit Button -->
                    <button
                        type="submit"
                        class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                        Cambia Password
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import user from '../states/user';
    import { clearUser } from '../states/user';

    import { useRouter } from 'vue-router';
    const router = useRouter();

    const userDetails = ref({});
    const sports = ref([]);
    
    const username = ref('');
    const email = ref('');
    const favoriteSports = ref([]);
    const preferredLocation = ref('');
    
    const oldPassword = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');
    
    async function fetchUserDetails() {
        try {
            const response = await fetch('http://localhost:3000/api/users/me', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
        
            if (!response.ok) throw new Error('Failed to fetch user details.');
        
            const data = await response.json();
            userDetails.value = data;
            username.value = data.username;
            email.value = data.email;
            favoriteSports.value = data.favoriteSports;
            preferredLocation.value = data.preferredLocation;
        } catch (error) {
            console.error(error);
        }
    }
    
    async function fetchSports() {
        try {
            const response = await fetch('http://localhost:3000/api/sports');
            if (!response.ok) throw new Error('Failed to fetch sports.');
        
            sports = await response.json();
        } catch (error) {
            console.error(error);
        }
    }
    
    async function updateUserDetails() {
        try {
            // get the sport names from the selected sports
            favoriteSports = favoriteSports.map((sport) => sport.nome);
            const response = await fetch('http://localhost:3000/api/users/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    username: username.value,
                    email: email.value,
                    favoriteSports: favoriteSports.value || [],
                    preferredLocation: preferredLocation.value || null,
                }),
            });
        
            if (!response.ok) throw new Error('Failed to update user details.');
        
            alert('User details updated successfully!');
            fetchUserDetails();
        } catch (error) {
            console.error(error);
        }
    }
    
    async function changePassword() {
        if (newPassword.value !== confirmPassword.value) {
            alert('New passwords do not match.');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3000/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    oldPassword: oldPassword.value,
                    newPassword: newPassword.value,
                }),
            });
        
            if (!response.ok) throw new Error('Failed to change password.');
        
            alert('Password changed successfully!');
            oldPassword.value = '';
            newPassword.value = '';
            confirmPassword.value = '';
        } catch (error) {
            console.error(error);
        }
    }

    async function logout() {
        clearUser();
        
        // redirect to the home page
        router.push('/');
    }
    
    onMounted(() => {
        fetchUserDetails();
        fetchSports();

        document.title = 'SporTN - Il Tuo Profilo';
    });
</script>
