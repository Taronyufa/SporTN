import { reactive } from 'vue';

const user = reactive({
  token: localStorage.getItem('token') || null, // Load from localStorage on initialization
  email: localStorage.getItem('email') || null,
  user_id: localStorage.getItem('user_id') || null,
});

export const setUser = (data) => {
  user.token = data.token;
  user.email = data.email;
  user.user_id = data.id;

  // Save to localStorage
  localStorage.setItem('token', data.token);
  localStorage.setItem('email', data.email);
  localStorage.setItem('user_id', data.id);
};

export const clearUser = () => {
  user.token = null;
  user.email = null;
  user.user_id = null;

  // Remove from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('email');
  localStorage.removeItem('user_id');
};

export default user;
