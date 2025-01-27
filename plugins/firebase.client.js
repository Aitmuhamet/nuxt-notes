import { defineNuxtPlugin } from "#app";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { useRuntimeConfig } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();
    const firebaseConfig = config.public.vuefire.config;

    const firebaseApp = initializeApp(firebaseConfig);

    const firebaseAuth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp);

});
