<template>
  <div class="bottom-controls text-neutral-500 flex gap-6
    ">
    <button
      class="btn bottom-controls__btn hover:text-stone-500"
      @click="noteStore.undo()"
      :disabled="!canUndo"
    >
      <Icon
        name="solar:double-alt-arrow-left-broken"
        class="text-4xl md:text-5xl text-amber-500 hover:text-stone-500"
      />
    </button>
    <button
      class="btn bottom-controls__btn hover:text-stone-500"
      @click="noteStore.redo()"
      :disabled="!canRedo"
    >
      <Icon
        name="solar:double-alt-arrow-right-broken"
        class="text-4xl md:text-5xl text-amber-500 hover:text-stone-500"
      />
    </button>
    <button
      class="btn bottom-controls__btn"
      type="button"
      @click="deleteNote(note)"
      aria-label="Delete Note"
    >
      <Icon
        name="solar:trash-bin-minimalistic-2-broken"
        class="text-4xl md:text-5xl text-amber-500 hover:text-amber-600"
      />
    </button>
    <button
      type="button"
      class="btn bottom-controls__btn"
      @click="discardChanges()"
      aria-label="Cancel Changes"
    >
      <Icon
        name="solar:close-circle-broken"
        class="text-4xl md:text-5xl text-amber-500 hover:text-red-500 "
      />
    </button>
  </div>

  <ConfirmDialog>
  </ConfirmDialog>
</template>

<script setup>
import { useNoteStore } from '~/store/noteStore';
import { useModalStore } from '~/store/modalStore';
import ConfirmDialog from '../ConfirmDialog.vue';

// 1. Инициализация зависимостей
const noteStore = useNoteStore();
const modalStore = useModalStore();

// 2. Реактивные переменные
// 3. Вычисляемые свойства
const note = computed({
  get: () => noteStore.currentNote
});
const canUndo = computed(() => noteStore.currentStep > 0);
const canRedo = computed(() => noteStore.currentStep < noteStore.history.length - 1);

// 4. Методы
const deleteNote = (note) => {
  modalStore.openModal("confirmDelete", note);
}

const discardChanges = () => {
  modalStore.openModal('comfirmDiscardChanges')
}

// 5. Логика
// 6. Хуки
// 7. Вспомогательные функции

</script>

<style lang="scss" scoped>
.bottom-controls {
  position: fixed;
  bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;

  border: 1px solid rgba(var(--primary-color), 0.3);
  border-radius: .75rem;
  padding: 1rem 2rem;

  &__btn {
    &:disabled {
      background: rgba(var(--primary-color), .1);
      background: transparent;
      color: rgb(var(--primary-color));
    }
  }
}
</style>