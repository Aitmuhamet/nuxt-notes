<script setup>
import { useNoteStore } from '~/store/noteStore';
const noteStore = useNoteStore();
const note = noteStore.currentNote;

import { useModalStore } from '~/store/modalStore';
import ConfirmDialog from '../ConfirmDialog.vue';
const modalStore = useModalStore();

const deleteNote = (note) => {
  modalStore.openModal("confirmDelete", note);
}

const discardChanges = () => {
  modalStore.openModal('comfirmDiscardChanges')
}

console.log('currentStep: ', noteStore.currentStep);

const canUndo = computed(() => noteStore.currentStep > 0);
const canRedo = computed(() => noteStore.currentStep < noteStore.history.length - 1);

console.log('canUndo: ', canUndo.value);
console.log('canRedo: ', canRedo.value);


</script>

<template>
  <div class="bottom-controls text-neutral-500 flex gap-6
    ">
    <button
      class="btn bottom-controls__btn"
      @click="noteStore.undo()"
      :disabled="!canUndo"
    >
      <Icon
        name="mingcute:back-2-line"
        class="text-4xl md:text-5xl hover:text-neutral-900"
      />
    </button>
    <button
      class="btn bottom-controls__btn"
      @click="noteStore.redo()"
      :disabled="!canRedo"
    >
      <Icon
        name="mingcute:forward-2-line"
        class="text-4xl md:text-5xl hover:text-neutral-900"
      />
    </button>
    <button
      class="btn bottom-controls__btn"
      type="button"
      @click="deleteNote(note)"
    >
      <Icon
        name="material-symbols:delete-outline-rounded"
        class="text-4xl md:text-5xl  hover:text-neutral-900"
      />
    </button>
    <button
      type="button"
      class="btn bottom-controls__btn"
      @click="discardChanges()"
    >
      <Icon
        name="material-symbols:close-rounded"
        class="text-red-500 text-4xl md:text-5xl "
      />
    </button>
  </div>

  <ConfirmDialog>
  </ConfirmDialog>
</template>

<style lang="scss" scoped>
.bottom-controls {
  position: fixed;
  bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;

  &__btn {
    padding: .5rem;

    &:disabled {
      background: rgb(var(--primary-color), .1);
    }
  }
}
</style>