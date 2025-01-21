<template>
  <header class="header container mx-auto mt-4 mb-8 px-4 flex items-center justify-start rounded-xl">
    <div class="text-xl lg:text-5xl flex gap-1">

      <button
        v-if="!isNoteEditPage"
        type="button"
        class="btn header__logo-btn"
        aria-label="Discard Changes"
        @click="router.push('/note-[new]')"
      >
        <Icon
          name="solar:notification-unread-bold-duotone"
          class=" text-3xl sm:text-4xl md:text-5xl text-amber-500 hover:text-amber-600"
        />
      </button>
      <button
        v-else-if="isNoteEditPage && isNoteTitleEmpty"
        type="button"
        class="btn header__logo-btn"
        aria-label="Return to Main Page"
        @click="router.push('/')"
      >
        <Icon
          name="solar:notification-unread-broken"
          class=" text-3xl sm:text-4xl md:text-5xl text-amber-500 hover:text-amber-600"
        />
      </button>
      <button
        v-else-if="isNoteEditPage && !isNoteTitleEmpty"
        type="button"
        class="btn header__logo-btn"
        @click="saveAndNavigate()"
        aria-label="Save and Navigate To Main Page"
      >
        <Icon
          name="solar:notification-unread-lines-broken"
          class=" text-3xl sm:text-4xl md:text-5xl text-amber-500 hover:text-amber-600"
        />
      </button>
    </div>

    <NuxtLink
      v-if="!isNoteEditPage"
      to="/"
      class="header__title py-1 my-3 text-xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold"
    >
      <h1>
        New List
      </h1>
    </NuxtLink>

    <input
      v-else
      type="text"
      v-model="note.title"
      placeholder="New List"
      ref="labelInput"
      class="header__title my-3 text-xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold focus:outline-none bg-transparent w-44 flex-[1_0_auto]"
    />

    <div class="header-actions text-xl lg:text-5xl flex gap-1">
      <button
        v-if="isUserNotOnAccountPage"
        type="button"
        class="btn header__btn"
        @click="router.push('/account')"
        aria-label="Logout"
      >
        <img
          v-if="authStore.user.value?.photoURL"
          :src="authStore.user.value?.photoURL"
          alt="Logo image"
          class="header__user-img h-12 w-12"
        >
        <Icon
          v-else
          name="solar:user-check-rounded-bold-duotone"
          class=" text-3xl sm:text-4xl md:text-5xl text-amber-500 hover:text-amber-600"
        />
      </button>
      <button
        v-else-if="isUserOnAccountPage"
        type="button"
        class="btn header__btn"
        aria-label="Login"
        @click="authStore.logout()"
      >
        <Icon
          name="solar:logout-3-bold-duotone"
          class=" text-3xl sm:text-4xl md:text-5xl text-amber-500 hover:text-amber-600"
        />
      </button>
      <button
        v-else
        type="button"
        class="btn header__btn"
        aria-label="Login"
        @click="router.push('/login')"
      >
        <Icon
          name="solar:login-3-line-duotone"
          class=" text-3xl sm:text-4xl md:text-5xl text-amber-500 hover:text-amber-600"
        />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification';
import { ref, computed, watchEffect, onMounted, onBeforeUnmount } from 'vue'
import { useNoteStore } from '~/store/noteStore';
import { useModalStore } from '~/store/modalStore';
import { useAuthStore } from '~/store/authStore';

// 1. Метаинформация
// 2. Инициализация зависимостей
const noteStore = useNoteStore();
const modalStore = useModalStore();
const authStore = useAuthStore();
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
const isUserNotOnAccountPage = computed(() => authStore.user.value && route.path !== '/account');
const isUserOnAccountPage = computed(() => authStore.user.value && route.path === '/account');

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
    toast.warning('Title is empry')
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
console.log('authStore.user:', authStore.user.value); 

</script>


<style lang="scss" scoped>
.header {
  * {
    transition: scale .3s, filter .3s, transform .3s;
  }

  &:has(:hover) :not(:hover) {
    scale: 0.98;
    filter: blur(2px);
  }

  font-family: 'Raleway',
  sans-serif;
  height: auto;
  position: sticky;
  top: 1rem;
  z-index: 99;
  background-color: var(--secondary-color);
  border: 1px solid rgba(var(--primary-color), 1);
  -webkit-box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
  box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);


  &__btn {
    background-color: transparent;
    overflow: hidden;

    &:hover {
      color: rgba(var(--primary-color), .8);
    }
  }

  &__logo-btn:focus-visible {
    border: 1px solid rgba(var(--primary-color), .4);
    outline: none;
  }

  &__title {
    padding-left: 1rem;
    padding-right: 1rem;

    @media (min-width: 1280px) {
      padding-left: 1.2rem;
    }
  }

  &__user-img {
    border-radius: 10px;
    padding: 0.2rem;
  }
}

.header-actions {
  margin-left: auto;
}
</style>