import { useUserStore } from "~/store/user";

export default defineNuxtPlugin(() => {
    const userStore = useUserStore();
    userStore.init();
  
    console.log('user', userStore.user);
    
});
