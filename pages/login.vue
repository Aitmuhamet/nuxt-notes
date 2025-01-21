<template>
    <div class="login-page">
        <div class="login-page__container">
            <form
                @submit.prevent="handleLogin"
                class="login-page__form"
            >
                <div class="login-page__form-group">
                    <label
                        for="email"
                        class="login-page__label"
                    >
                        <Icon
                            v-if="email.length === 0"
                            name="solar:mailbox-line-duotone"
                            class=" text-xl sm:text-lg md:text-3xl text-amber-500 hover:text-amber-600"
                        />
                        <Icon
                            v-else
                            name="solar:mailbox-bold-duotone"
                            class=" text-xl sm:text-lg md:text-3xl text-amber-500 hover:text-amber-600"
                        />
                    </label>
                    <input
                        type="email"
                        id="email"
                        v-model="email"
                        placeholder="Email"
                        class="login-page__input"
                        required
                    />
                </div>
                <div class="login-page__form-group">
                    <label
                        for="password"
                        class="login-page__label"
                    >
                        <Icon
                            v-if="password.length === 0"
                            name="solar:password-minimalistic-input-line-duotone"
                            class=" text-xl sm:text-lg md:text-3xl text-amber-500 hover:text-amber-600"
                        />
                        <Icon
                            v-else
                            name="solar:password-minimalistic-input-bold-duotone"
                            class=" text-xl sm:text-lg md:text-3xl text-amber-500 hover:text-amber-600"
                        />
                    </label>
                    <input
                        type="password"
                        id="password"
                        v-model="password"
                        placeholder="Password"
                        class="login-page__input"
                        required
                    />
                </div>

                <div class="login-page__authk-buttons">
                    <button
                        type="submit"
                        class="btn login-page__button login-page__button--login"
                    >
                        Login
                    </button>

                    <button
                        @click.prevent="handleGoogleLogin"
                        class="btn login-page__button login-page__button--google"
                    >
                        <Icon
                            name="logos:google-icon"
                            class=" text-xl sm:text-lg md:text-3xl text-amber-500 hover:text-amber-600"
                        />
                    </button>
                </div>
            </form>

            <div class="login-page__footer">
                <button
                    @click="router.push('/register')"
                    class="login-page__link"
                >
                    <Icon
                        name="solar:users-group-rounded-bold-duotone"
                        class=" text-xl text-amber-500 hover:text-amber-600"
                    />
                    Register
                </button>
                <a
                    href="/forgot-password"
                    class="login-page__link"
                >
                    <Icon
                        name="solar:user-rounded-broken"
                        class=" text-xl text-amber-500 hover:text-amber-600"
                    />
                    Forgot Password?
                </a>
            </div>
        </div>
    </div>
</template>



<script setup>
import { useAuthStore } from '~/store/authStore';
// 1. Метаинформация
useHead({
    title: `Login`, // Подставляем "Untitled", если title еще не загружен
    meta: [
        { name: 'description', content: 'Login Page.' }
    ]
});
definePageMeta({
    layout: 'auth',
    name: 'Login',
})

// 2. Инициализация зависимостей
const authStore = useAuthStore()
const router = useRouter();

// 3. Реактивные переменные
const email = ref('');
const password = ref('');

// 4. Вычисляемые свойства
// 5. Логика
// 6. Методы
const handleLogin = async () => {
    if (!email.value || !password.value) {
        alert('Please fill in all fields.');
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        console.log('Logged in as', userCredential.user);
        router.push('/');  // Переход на страницу после успешного входа
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
};
const handleGoogleLogin = () => {
    authStore.login();
    authStore.init();
};
// 7. Хуки
// 8. Дополнительные подписки
</script>

<style scoped lang="scss">
.login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100svh;
    background-color: #f5f5f5;
}

.login-page__container {
    background-color: #ffffff;
    padding: 8rem 3rem;
    margin: 0 15px;
    border: 1px solid rgba(var(--primary-color), 1);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    width: 100%;
    height: calc(100svh - 30px);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    @media (min-width: 768px) {
        padding: 8rem 5rem;
        max-width: 450px;
        height: auto;
    }
}

.login-page__form {
    margin-bottom: .5rem;
}

.login-page__form-group {
    margin-bottom: 1rem;
    padding: .25rem .5rem;
    border: 1px solid rgb(var(--primary-color), .4);
    border-radius: 8px;
    transition: border .3s, border-radius .3s;

    display: flex;
    align-items: center;
    gap: .5rem;

    position: relative;
    box-shadow: 0 0 0 1px transparent;


    &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        display: block;
        width: 0;
        height: 1px;
        background-color: rgba(var(--primary-color), .4);
        transition: width .3s;
    }
    &:focus-within,
    &:hover {
        border: 1px solid transparent;

        &::after {
            width: 95%;
        }
    }
}

.login-page__label {
    display: flex;
    align-items: center;
    font-weight: bold;
    color: #555;
}

.login-page__input {
    width: 100%;
    padding: 0.25rem;
    font-size: 1.5rem;
    outline: none;
}

.login-page__authk-buttons {
    display: flex;
    gap: 1rem;

    margin-top: 1rem;
}

.login-page__button {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 4px;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    &--login {
        flex: 1 1 auto;
        font-size: 1.25rem;
        color: var(--text-color);
        text-transform: uppercase;
        background-color: rgb(var(--primary-color), .05);
    }

    &--login:hover {
        background-color: rgb(var(--primary-color), .1);
    }

    &--google {
        flex: 0 0 50px;
        background-color: #fad9d6;
        color: #ffffff;

        &:hover {
            background-color: #e7c7c2;
        }
    }
}

.login-page__footer {
    text-align: center;
    margin-top: .5rem;

    display: flex;
    align-items: center;
    justify-content: space-between;
}

.login-page__link {
    display: flex;
    align-items: center;
    margin: 0.5rem 0;
    color: var(--text-color);
    font-size: .75rem;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
}
</style>
