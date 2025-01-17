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
        name="solar:double-alt-arrow-left-broken"
        class="text-4xl md:text-5xl hover:text-neutral-900"
      />
    </button>
    <button
      class="btn bottom-controls__btn"
      @click="noteStore.redo()"
      :disabled="!canRedo"
    >
      <Icon
        name="solar:double-alt-arrow-right-broken"
        class="text-4xl md:text-5xl hover:text-neutral-900"
      />
    </button>
    <button
      class="btn bottom-controls__btn"
      type="button"
      @click="deleteNote(note)"
    >
      <Icon
        name="solar:trash-bin-minimalistic-2-broken"
        class="text-4xl md:text-5xl  hover:text-neutral-900"
      />
    </button>
    <button
      type="button"
      class="btn bottom-controls__btn"
      @click="discardChanges()"
    >
      <Icon
        name="solar:close-circle-broken"
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

  border: 1px solid rgba(var(--primary-color), 0.3);
  border-radius: .75rem;
  padding: 1rem 2rem;

  &__btn {
    padding: .5rem;

    &:disabled {
      background: rgba(var(--primary-color), .1);
      background: transparent;
      color: rgb(var(--primary-color));
    }
  }
}
</style>