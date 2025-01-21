<script setup>
import { useAuthStore } from './store/authStore';

// 1. Инициализация зависимостей
const authStore = useAuthStore();
const user = useCurrentUser();
const router = useRouter();


// 2. Реактивные переменные
// 3. Вычисляемые свойства
// 4. Методы
// 5. Сайд-эффекты
onMounted(() => {
  watch(user, (currentUser, prevUser) => {
    
    authStore.init(); 
    
    console.group('onMounted: app');
    console.log('currentUser: ', currentUser);
    console.log('prevUser: ', prevUser);
    console.groupEnd();
    
    if (prevUser && !currentUser) {
      console.log('user', user);
      return router.replace('/')
    } else if(prevUser && !currentUser) {
      return router.replace('/login')
    }
  })
})

// 6. Дополнительные подписки
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
.layout-enter-active,
.layout-leave-active {
  transition: all 0.2s;
}
.layout-enter-from,
.layout-leave-to {
  filter: blur(1rem);
}

.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>