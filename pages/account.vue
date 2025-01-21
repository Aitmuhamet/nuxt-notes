<template>
  account page
  <button
    @click="signInWithGoogle"
    class="btn"
  >login</button>
  <!-- <button
    @click="authStore.logout"
    class="btn"
  >Logout</button> -->
  {{ authStore.user }}
  user {{ user }}
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
// 5. Логика
authStore.init();

import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

function signInWithGoogle() {
    signInWithPopup(auth, new GoogleAuthProvider())
        .then(() => router.replace('/'))
}

const user = useCurrentUser();
// 5. Сайд-эффекты
// 6. Дполнительные подписки


</script>
