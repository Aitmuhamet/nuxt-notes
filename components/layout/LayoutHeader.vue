<template>
  <header class="header container mx-auto mt-4 mb-8 rounded-xl">
    <NuxtLink
      v-if="!isNoteEditPage"
      to="/"
      class="header__title header__title-link py-1 my-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold"
    >
      <h1>
        Lists
      </h1>
    </NuxtLink>

    <input
      v-else
      type="text"
      v-model="note.title"
      placeholder="List Title"
      ref="labelInput"
      class="header__title my-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold focus:outline-none bg-transparent w-44"
    />

    <div 
    v-if="!isUserOnAccountPage"
    class="text-xl lg:text-5xl flex flex-col">
      <button
        v-if="!isNoteEditPage"
        type="button"
        class="btn header__btn header__logo-btn"
        aria-label="Discard Changes"
        @click="router.push('/note-[new]')"
      >
        <div class="btn-inner">
          <Icon
            name="solar:notification-unread-bold-duotone"
            class=" text-4xl md:text-5xl text-amber-500 hover:text-amber-600"
          />
        </div>
        {{ noteButtonText }}
      </button>
      <button
        v-else-if="isNoteEditPage && isNoteTitleEmpty"
        type="button"
        class="btn header__btn header__logo-btn"
        aria-label="Return to Main Page"
        @click="router.push('/')"
      >
        <div class="btn-inner">
          <Icon
            name="solar:notification-unread-broken"
            class=" text-4xl md:text-5xl text-amber-500 hover:text-amber-600"
          />
        </div>
        {{ noteButtonText }}
      </button>
      <button
        v-else-if="isNoteEditPage && !isNoteTitleEmpty"
        type="button"
        class="btn header__btn header__logo-btn"
        @click="saveAndNavigate()"
        aria-label="Save and Navigate To Main Page"
      >
        <div class="btn-inner">
          <Icon
            name="solar:notification-unread-lines-broken"
            class=" text-4xl md:text-5xl text-amber-500 hover:text-amber-600"
          />
        </div>
        {{ noteButtonText }}
      </button>
      <span class="text-[8px] leading-3 md:text-xs text-amber-500 hover:text-amber-600 text-center">
      </span>
    </div>

    <div
      v-if="!isNoteEditPage"
      class="header-actions text-xl lg:text-5xl flex flex-col"
    >
      <button
        v-if="isUserNotOnAccountPage"
        type="button"
        class="btn header__btn"
        @click="router.push('/profile')"
        aria-label="Settings"
      >
        <div class="btn-inner">
          <img
            v-if="userStore.user.value?.photoURL"
            :src="userStore.user.value?.photoURL"
            alt="Logo image"
            class="header__user-img h-8 w-8  sm:h-10 sm:w-10 md:h-12 md:w-12"
          >
          <Icon
            v-else
            name="solar:user-check-rounded-bold-duotone"
            class=" text-4xl md:text-5xl text-amber-500 hover:text-amber-600"
          />
        </div>
        {{ userButtonText }}
      </button>
      <button
        v-else-if="isUserOnAccountPage"
        type="button"
        class="btn header__btn"
        aria-label="Login"
        @click="userStore.logout()"
      >
        <div class="btn-inner">
          <Icon
            name="solar:logout-3-bold-duotone"
            class=" text-4xl md:text-5xl text-amber-500 hover:text-amber-600"
          />
        </div>
        {{ userButtonText }}
      </button>
      <button
        v-else
        type="button"
        class="btn header__btn"
        aria-label="Logout"
        @click="router.push('/login')"
      >
        <div class="btn-inner">
          <Icon
            name="solar:login-3-line-duotone"
            class=" text-4xl md:text-5xl text-amber-500 hover:text-amber-600"
          />
        </div>
        {{ userButtonText }}
      </button>
      <span class="text-[8px] leading-3 md:text-xs text-amber-500 hover:text-amber-600 text-center">
      </span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification';
import { ref, computed, watchEffect, onMounted, onBeforeUnmount } from 'vue'
import { useNoteStore } from '~/store/noteStore';
import { useModalStore } from '~/store/modalStore';
import { useUserStore } from '~/store/user';

// 1. Метаинформация
// 2. Инициализация зависимостей
const noteStore = useNoteStore();
const modalStore = useModalStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();

// 3. Реактивные переменные
const labelInput = ref<HTMLInputElement | null>(null);

// 4. Вычисляемые свойства
const note = computed({
  get: () => noteStore.currentNote,
  set: (value) => noteStore.currentNote = value
});
const isNoteTitleEmpty = computed(() => noteStore.currentNote.title?.length === 0)
const isNoteEditPage = computed(() => route.path.includes('/note'));
const isUserNotOnAccountPage = computed(() => userStore.user.value && route.path !== '/profile');
const isUserOnAccountPage = computed(() => userStore.user.value && route.path === '/profile');
const noteButtonText = computed(() => (isNoteEditPage.value && isNoteTitleEmpty.value) ? 'All Lists' : (isNoteEditPage.value && !isNoteTitleEmpty.value) ? 'Save' : 'New');
const userButtonText = computed(() => isUserNotOnAccountPage.value ? 'Profile' : isUserOnAccountPage.value ? 'Logout' : 'Login');

// 5. Логика
// 6. Методы
const handleKeydown = (event) => {
  if (event.code === 'Enter' && route.path !== '/') {
    saveAndNavigate();
  } else if (event.code === 'Space' && route.path === '/') {
    router.push('/note-[new]')
  } else if (event.code === 'Escape' && route.path !== '/') {
    discardChanges();
  }
}

const saveAndNavigate = () => {
  console.log('isNoteTitleEmpty:', isNoteTitleEmpty.value);

  if (!isNoteTitleEmpty.value) {
    noteStore.saveNote();
    noteStore.resetHistory();
    router.push('/');
  } else {
    toast.warning('Title is empry', {
      position: 'bottom-center'
    });
  }
}

const discardChanges = () => {
  if (route.path !== '/' && noteStore.currentStep !== 0) {
    modalStore.openModal('comfirmDiscardChanges');
  } else if (route.path !== '/' && noteStore.currentStep === 0) {
    console.log('router.push');

    router.push('/');
  }
}

// 7. Хуки
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  if (labelInput.value) {
    labelInput.value.focus()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// 8. Дополнительные подписки
watchEffect(() => {
  if (labelInput.value) {
    labelInput.value.focus()
  }
})

// 9. Вспомогательные функции
</script>


<style lang="scss" scoped>
.header {
  position: sticky;
  top: 1rem;
  z-index: 99;

  display: flex;
  align-items: center;
  justify-content: start;

  font-family: 'Raleway',
    sans-serif;
  height: auto;
  padding: 0 .25rem;
  background-color: var(--secondary-color);
  border: 1px solid rgba(var(--primary-color), 1);
  -webkit-box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
  box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);

  &__btn {
    font-family: 'Inter';
    font-weight: 400;
    color: #5d5d5d;
    padding: .5rem .5rem;

    &:hover {
      color: rgba(var(--primary-color), 0.8);
    }
  }

  &__logo-btn:focus-visible {
    border: 1px solid rgba(var(--primary-color), .4);
    outline: none;
  }

  &__title {
    flex: 1 0 auto;
    padding: 0 1rem;
    height: 100%;
    display: flex;
    align-items: center;
    transition: transform .3s, color .3s;

    &-link:hover {
      transform: scale(1.01);
      color: rgba(var(--primary-color), 0.8);
    }

  }
  
  &__user-img {
    border-radius: 10px;
    padding: 0.2rem;
  }
}
@media (min-width: 640px) {
  .header {
    padding: 0 .5rem;

    &__btn {
      padding: 1rem .5rem;
    }
  }
}
@media (min-width: 1280px) {
  .header__title {
    padding-left: 1.2rem;
  }
}

.header-actions {
  margin-left: auto;
}
</style>