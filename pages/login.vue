<script setup>
import { useAuthStore } from '~/store/authStore';
// Метаинформация
useHead({
    title: `Login`, // Подставляем "Untitled", если title еще не загружен
    meta: [
        { name: 'description', content: 'Login Page.' }
    ]
});

// 1. Инициализация зависимостей
const authStore = useAuthStore()

// 2. Реактивные переменные
// 3. Вычисляемые свойства
// 4. Методы
// 5. Сайд-эффекты
// 6. Дополнительные подписки
</script>

<template>
    <div class="container mx-auto">
        login page
        <button
            class="btn login-btn"
            @click="authStore.login()"
        >
            <Icon name="logos:google-icon" />
        </button>
    </div>
</template>

<style scoped>
.login-btn {
    padding: 1rem;
    display: flex;
    gap: 0.5rem;
    font-size: 1em;
}
</style>