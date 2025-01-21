<template>
        <div class="register-page">
            <div class="register-page__container">
                <form
                    @submit.prevent="handleRegister"
                    class="register-page__form"
                >
                    <div class="register-page__form-group">
                        <label
                            for="name"
                            class="register-page__label"
                        >
                            <Icon
                                v-if="name.length === 0"
                                name="solar:user-rounded-line-duotone"
                                class=" text-xl sm:text-lg md:text-3xl text-amber-500 hover:text-amber-600"
                            />
                            <Icon
                                v-else
                                name="solar:user-bold-duotone"
                                class=" text-xl sm:text-lg md:text-3xl text-amber-500 hover:text-amber-600"
                            />
                        </label>
                        <input
                            type="text"
                            id="name"
                            v-model="name"
                            placeholder="Full Name"
                            class="register-page__input"
                            required
                        />
                    </div>
                    <div class="register-page__form-group">
                        <label
                            for="email"
                            class="register-page__label"
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
                            class="register-page__input"
                            required
                        />
                    </div>
                    <div class="register-page__form-group">
                        <label
                            for="password"
                            class="register-page__label"
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
                            class="register-page__input"
                            required
                        />
                    </div>
                    <div class="register-page__form-group">
                        <label
                            for="confirmPassword"
                            class="register-page__label"
                        >
                            <Icon
                                v-if="confirmPassword.length === 0"
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
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            v-model="confirmPassword"
                            class="register-page__input"
                            required
                        />
                    </div>

                    <!-- Блок с кнопками для регистрации -->
                    <div class="register-page__auth-buttons">
                        <button
                            type="submit"
                            class="btn register-page__button register-page__button--register"
                        >Sign In</button>

                        <button
                            @click.prevent="handleGoogleLogin"
                            class="btn register-page__button register-page__button--google"
                        >
                            <Icon
                                name="logos:google-icon"
                                class=" text-xl sm:text-lg md:text-3xl text-amber-500 hover:text-amber-600"
                            />
                        </button>
                    </div>
                </form>

                <div class="register-page__footer">
                    <NuxtLink
                        to="/login"
                        class="register-page__link"
                    >
                        Already have an profile?
                        <Icon
                            name="solar:user-check-bold-duotone"
                            class=" text-xl text-sm text-amber-500 hover:text-amber-600"
                        />
                        Login
                    </NuxtLink>
                </div>
            </div>
        </div>
</template>

<script setup>
import { useAuthStore } from "~/store/authStore";
import { useToast } from "vue-toastification";

// 1. Метаинформация
useHead({
    title: `Register`, // Подставляем "Untitled", если title еще не загружен
    meta: [
        { name: 'description', content: 'Register Page.' }
    ]
});
definePageMeta({
    layout: "auth",
    name: 'Register',
})

// 2. Инициализация зависимостей
const authStore = useAuthStore()
const router = useRouter();
const toast = useToast();

// 3. Реактивные переменные
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

// 4. Методы
const handleRegister = async () => {
    if (password.value !== confirmPassword.value) {
        toast.error('Passwords do not match', {
            position: 'bottom-center'
        });
        return;
    }

    await authStore.register({
        name: name.value,
        email: email.value,
        password: password.value
    });

    if (authStore.user) {
        router.push('/profile');
    }
}

const handleGoogleLogin = async () => {
    await authStore.login();
    if (authStore.user) {
        router.push('/profile');
    }
}


</script>

<style scoped lang="scss">
.register-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
}

.register-page__container {
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

.register-page__form {
    margin-bottom: .5rem;
}

.register-page__form-group {
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

.register-page__label {
    display: flex;
    align-items: center;
    font-weight: bold;
    color: #555;
}

.register-page__input {
    width: 100%;
    padding: 0.25rem;
    font-size: 1.5rem;
    outline: none;
}

.register-page__auth-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.register-page__button {
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

    &--register {
        flex: 1 1 auto;
        font-size: 1.25rem;
        color: var(--text-color);
        text-transform: uppercase;
        background-color: rgb(var(--primary-color), .05);
    }

    &--register:hover {
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

.register-page__footer {
    text-align: center;
    margin-top: .5rem;

    display: flex;
    align-items: center;
    justify-content: center;
}

.register-page__link {
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
