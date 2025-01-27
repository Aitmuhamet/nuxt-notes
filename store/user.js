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
    updateProfile,
} from "firebase/auth";


export const useUserStore = defineStore("user", () => {
    // 1. Инициализация зависимостей
    const router = useRouter();

    // 2. Реактивные переменные
    const user = ref(null);
    const loading = ref(true);
    const auth = getAuth();

    // 3. Вычисляемые свойства
    // 4. Методы
    const init = () => {
        user.value = useCurrentUser();
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();

        try {
            await signInWithPopup(auth, provider);
            user.value = useCurrentUser();
            router.replace("/");
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        if (auth) {
            await signOut(auth);
            user.value = null;
            router.replace("/");
        } else {
            console.error("Authentication object is null");
        }
    };

    const registerWithEmail = async (email, password, name) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('userCredential', userCredential);
            user.value = useCurrentUser();

            await updateProfile(userCredential.user, {
                displayName: name,
            }
            )
        } catch (error) {
            throw error;
        }
    }

    const loginWithEmail = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            console.log('userCredential', userCredential);
            user.value = useCurrentUser();
        } catch (error) {
            throw error;
        }
    }

    // 5. Хуки
    // 6. Вспомогательные функции

    return {
        user,
        loading,
        init,
        loginWithGoogle,
        registerWithEmail,
        loginWithEmail,
        logout,
    };
});
