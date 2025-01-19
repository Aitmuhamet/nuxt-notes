<script setup lang="ts">
import { useToast } from 'vue-toastification';
import { ref, watchEffect, onMounted, onBeforeUnmount } from 'vue'
import { useNoteStore } from '~/store/noteStore';
const noteStore = useNoteStore();

import { useModalStore } from '~/store/modalStore';
const modalStore = useModalStore();

const router = useRouter();
const route = useRoute()
const isNotePage = computed(() => route.path.includes('/note'));

const discardChanges = () => {
  console.log('route.path:', route.path);
  console.log('noteStore:', noteStore.currentStep);

  if (route.path !== '/' && noteStore.currentStep !== 0) {
    modalStore.openModal('comfirmDiscardChanges');
  } else if (route.path !== '/' && noteStore.currentStep === 0) {
    console.log('router.push');

    router.push('/');
  }
}

const labelInput = ref<HTMLInputElement | null>(null);

const isNoteTitleEmpty = () => {
  return noteStore.currentNote.title.length === 0;
}


const toast = useToast();
const saveAndNavigate = () => {
  if (!isNoteTitleEmpty()) {
    noteStore.saveNote();
    noteStore.resetHistory();
    router.push('/');
  } else {
    toast.warning('Title is empry')
  }
}

const note = computed({
  get: () => noteStore.currentNote,
  set: (value) => noteStore.currentNote = value
});

watchEffect(() => {
  if (labelInput.value) {
    labelInput.value.focus()
  }
})

const handleKeydown = (event) => {
  if (event.code === 'Enter' && route.path !== '/') {
    saveAndNavigate();
  } else if (event.code === 'Space' && route.path === '/') {
    router.push('/note/[new]')
  } else if (event.code === 'Escape' && route.path !== '/') {
    discardChanges();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  if (labelInput.value) {
    labelInput.value.focus()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

</script>

<template>
  <header class="header container mx-auto my-4 flex items-center justify-start rounded-xl">
    <button
      @click="discardChanges"
      to="/"
      class="header__logo-btn"
    >
      <img
        src="/logo.svg"
        alt="Logo"
        class="header__logo-image p-2 h-4"
      />
    </button>

    <h1
      v-if="!isNotePage"
      class="header__title header__title--button w-44 flex-[1_0_auto] text-xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold pe-4 cursor-pointer"
    ><Nuxt-link to="/note/[new]">New List</Nuxt-link></h1>
    <input
      v-else
      type="text"
      v-model="note.title"
      placeholder="New List"
      ref="labelInput"
      class="header__title bg-transparent w-44 flex-[1_0_auto] text-xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold focus:outline-none pe-4"
    />

    <div class="header-actions text-xl lg:text-5xl flex gap-1 pe-4">
      <button
        type="button"
        class="btn header__btn"
        v-if="isNotePage"
        @click="saveAndNavigate()"
      >
        <Icon
          name="solar:archive-check-broken"
          class=" text-3xl sm:text-4xl md:text-5xl text-amber-500 hover:text-green-500"
        />
      </button>
      <Nuxt-Link
        to="/note/[new]"
        class="btn header__btn"
        v-else
      >
        <Icon
          name="solar:traffic-economy-line-duotone"
          class=" text-3xl sm:text-4xl md:text-5xl text-amber-500 hover:text-green-500"
        />
      </Nuxt-Link>
    </div>
  </header>
</template>``

<style lang="scss" scoped>
.header {
  font-family: 'Raleway', sans-serif;
  height: auto;
  position: sticky;
  top: 1rem;
  z-index: 99;
  background-color: var(--secondary-color);
  border: 1px solid rgba(var(--primary-color), 1);
  -webkit-box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
  box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  // border: 1px solid rgba(var(--primary-color), .4);
  background-color: transparent;
  border: none;
  border-radius: 5px;
  font-size: 3rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    color: rgba(var(--primary-color), .8);
  }
}

.header {
  &__logo-image {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 5em;
    will-change: filter;
    transition: filter 300ms;

    @media (min-width: 768px) {
      height: unset;
    }
  }

  &__logo-btn:focus-visible {
    border: 1px solid rgba(var(--primary-color), .4);
    outline: none;
    border-radius: .75rem;
  }

  &__title--button {
    transition: color .2s;
    &:hover {
      color: rgb(var(--primary-color));
    }
  }
}

.header-actions {
  margin-left: auto;

}
</style>