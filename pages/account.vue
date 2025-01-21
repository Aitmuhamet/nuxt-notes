<template>
  account page
  <button @click="authStore.logout" class="btn">Logout</button>
  {{ authStore.user }}
</template>

<script setup>
import { useAuthStore } from '~/store/authStore';
// Метаинформация
useHead({
  title: `Account Data || Untitled`, // Подставляем "Untitled", если title еще не загружен
  meta: [
    { name: 'description', content: 'User Data Page.' }
  ]
});

// 1. Инициализация зависимостей
const authStore = useAuthStore();

// 2. Реактивные переменные
// 3. Вычислияемые переменные
// 4. Методы
// 5. Сайд-эффекты
// 6. Дполнительные подписки


</script>
