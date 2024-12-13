import { reactive } from 'vue';

const user = reactive({
  token: null,
  email: null,
});

export const setUser = (data) => {
  user.token = data.token;
  user.email = data.email;
};

export const clearUser = () => {
  user.token = null;
  user.email = null;
};

export default user;
