import { useAuthStore } from "~/store/authStore";

export default defineNuxtPlugin(() => {
    const authStore = useAuthStore();
    authStore.init();
  
    console.log('user', authStore.user);
    
});
