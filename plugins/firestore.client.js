import { defineNuxtPlugin } from "#app";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { useUserStore } from "~/store/user";

export default defineNuxtPlugin(() => {
    const userStore = useUserStore();
    userStore.init();
    console.log('user', userStore.user);
  
    const config = useRuntimeConfig();
    const firebaseConfig = config.public.firebaseConfig;
    console.log('firebaseConfig', firebaseConfig);

    const firebaseApp = initializeApp(firebaseConfig);
    const firebaseAuth = getAuth(firebaseApp);
    
    // return {
    //     provide: {
    //         firebaseApp,
    //         firebaseAuth,
    //     },
    // }
    
});
