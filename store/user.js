import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";

export const useUserStore = defineStore("user", () => {
    // 1. Инициализация зависимостей
    const router = useRouter();

    // 2. Реактивные переменные
    const user = ref(null);
    const loading = ref(true);

    // 3. Вычисляемые свойства
    // 4. Методы
    const init = () => {
        user.value = useCurrentUser();
    };

    const regitsterWithEmail = async (email, password) => {
        
    }

    const login = async () => {
        const auth = getAuth();

        try {
            await signInWithPopup(auth, new GoogleAuthProvider());
            user.value = useCurrentUser();
            router.replace("/");
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        const auth = getAuth();
        if (auth) {
            await signOut(auth);
            user.value = null;
            router.push("/");
        } else {
            console.error("Authentication object is null");
        }
    };

    // 5. Хуки
    // 6. Вспомогательные функции

    return {
        user,
        loading,
        init,
        login,
        logout,
    };
});
