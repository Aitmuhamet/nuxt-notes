<template>
  <div class="user-profile">
    <!-- Фото -->
    <div class="user-profile__photo">
      <img
        v-if="user.photoURL"
        :src="user.photoURL"
        alt="User Photo"
        class="user-profile__image"
      >
      <Icon
            v-else
            name="solar:user-check-rounded-bold-duotone"
            class=" text-6xl sm:text-8xl md:text-9xl text-amber-500 hover:text-amber-600"
          />
    </div>

    <!-- Информация -->
    <div class="user-profile__info">
      <h1 class="user-profile__name">{{ user.displayName }}</h1>
      <p class="user-profile__email">{{ user.email }}</p>
    </div>

    <!-- Статистика -->
    <div class="user-profile__stats">
      <div class="user-profile__stat">
        <span class="user-profile__stat-number">{{ noteStore.todosListsCount }}</span>
        <span class="user-profile__stat-label">Lists</span>
      </div>
      <div class="user-profile__stat">
        <span class="user-profile__stat-number">{{ noteStore.completedTodosCount }} / {{ noteStore.numberOfTasks
          }}</span>
        <span class="user-profile__stat-label">Completed tasks</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '~/store/user';
import { useNoteStore } from '~/store/noteStore';
// Метаинформация
useHead({
  title: `Profile`, // Подставляем "Untitled", если title еще не загружен
  meta: [
    { name: 'description', content: 'User Data Page.' }
  ]
});

// 1. Инициализация зависимостей
const userStore = useUserStore();
const user = useCurrentUser();
const noteStore = useNoteStore();

// 2. Реактивные переменные
// 3. Вычислияемые переменные
// 4. Методы

// 5. Логика
// 5. Хуки
onBeforeMount(() => {
  // userStore.init();
})
// 6. Дполнительные подписки
</script>

<style lang="scss" scoped>
.user-profile {
  max-width: 600px;
  margin: 0 auto;
  padding: 4rem 8rem;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-profile__photo {
  margin-bottom: 20px;
}

.user-profile__image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ddd;
}

.user-profile__info {
  margin-bottom: 20px;
}

.user-profile__name {
  font-size: 24px;
  margin: 0 0 8px;
  color: #333;
}

.user-profile__email {
  font-size: 16px;
  color: #777;
}

.user-profile__stats {
  display: flex;
  justify-content: center;
  gap: 40px;
}

.user-profile__stat {
  text-align: center;
}

.user-profile__stat-number {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.user-profile__stat-label {
  display: block;
  font-size: 14px;
  color: #666;
}
</style>
