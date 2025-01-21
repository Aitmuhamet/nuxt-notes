import { defineStore } from "pinia";
import { ref } from "vue";
import {
    onAuthStateChanged,
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
} from "firebase/auth";

export const useAuthStore = defineStore("auth", () => {
    // 1. Инициализация зависимостей
    const router = useRouter();

    // 2. Реактивные переменные
    const user = ref(null);
    const loading = ref(true);

    // 3. Вычисляемые свойства
    // 4. Методы
    const init = () => {
        const auth = getAuth();
        // Проверяем, есть ли данные пользователя в localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            user.value = JSON.parse(storedUser); // Восстанавливаем из localStorage
            loading.value = false;
        }
        onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                const userData = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    photoURL: firebaseUser.photoURL,
                };
                localStorage.setItem("user", JSON.stringify(userData));
            } else {
                user.value = null;
                localStorage.removeItem("user");
            }
            loading.value = false;
        });
    };

    const login = async (email = null, password = null) => {
        const auth = getAuth();
        console.log("auth", auth);

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
            signOut(auth);
            user.value = null;
            router.push("/");
        } else {
            console.error("Authentication object is null");
        }

        router.replace("/login");
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
