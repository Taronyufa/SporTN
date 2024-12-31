import { reactive } from 'vue';

const user = reactive({
  token: localStorage.getItem('token') || null, // Load from localStorage on initialization
  email: localStorage.getItem('email') || null,
  user_id: localStorage.getItem('user_id') || null,
  admin: JSON.parse(localStorage.getItem('admin')) || false,
});

export const setUser = (data) => {
  user.token = data.token;
  user.email = data.email;
  user.user_id = data.id;
  user.admin = data.admin;

  // Save to localStorage
  localStorage.setItem('token', data.token);
  localStorage.setItem('email', data.email);
  localStorage.setItem('user_id', data.id);
  localStorage.setItem('admin', data.admin);
};

export const clearUser = () => {
  user.token = null;
  user.email = null;
  user.user_id = null;
  user.admin = null;

  // Remove from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('email');
  localStorage.removeItem('user_id');
  localStorage.removeItem('admin');
};

export default user;
