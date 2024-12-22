import { reactive } from 'vue';

const user = reactive({
  token: null,
  email: null,
});

export const setUser = (data) => {
  user.token = data.token;
  user.username = data.username;
  user.email = data.email;
};

export const clearUser = () => {
  user.token = null;
  user.username = null;
  user.email = null;
};

export default user;
