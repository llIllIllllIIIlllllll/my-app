import { writable } from "svelte/store";
import type Auth  from "firebase/auth";

const authStore = writable<{
  isLoggedIn: boolean;
  user?: Auth.UserInfo;
  firebaseControlled: boolean;
}>({
  isLoggedIn: false,
  firebaseControlled: false,
});

export default {
  subscribe: authStore.subscribe,
  set: authStore.set,
};