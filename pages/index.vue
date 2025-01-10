<script setup>
import { computed } from 'vue';
import { useNoteStore } from '~/store/noteStore';
const noteStore = useNoteStore();

onMounted(() => {
  noteStore.loadNotesFromLocalStorage();
})

import { useModalStore } from '~/store/modalStore';
import ConfirmDialog from '~/components/ConfirmDialog.vue';
const modalStore = useModalStore();

const router = useRouter();

const navigateWithReset = (id) => {
  noteStore.resetHistory();
  router.push(`/note/${id}`);
}

const deleteNote = (note) => {
  modalStore.openModal('confirmDelete', note);
}

const first3Tasks = (tasks) => {
  return tasks.slice(0, 3);
}

</script>

<template>
  <ClientOnly>
    <div
      translate="no"
      class="notes-container container mx-auto sm:columns-3 lg:columns-3 xl:columns-4 gap-4 h-full hover:cursor-pointer"
    >
      <div
        class="note overflow-hidden pb-6 hover:scale-[1.03] transition-transform duration-300 ease-in-out relative"
        v-for="(note) in noteStore.notes"
        :key="note.id"
        @click="navigateWithReset(note.id)"
      >
        <h3 class="note-title p-2 md:p-4 text-slate-600 bg-orange-300 flex justify-between items-center">
          {{ note.title }}
        </h3>
        <ul class="tasks m-2 md:m-4 text-slate-700 flex flex-col items-stretch">
          <li
            v-for="(task) in first3Tasks(note.tasks)"
            :key="task.id"
            class="tasks__item"
          >
            <input
              type="checkbox"
              :id="'task' + task.id"
              v-model="task.isCompleted"
              class="tasks__checkbox checkbox"
              disabled
            />
            {{ task.text }}
          </li>
        </ul>
        <button
          class="header__btn btn w-8 h-8 p-0.5 absolute bottom-1 right-1 opacity-0"
          @click.stop="deleteNote(note)"
          type="button"
        >
          <Icon
            name="solar:trash-bin-minimalistic-2-broken"
            class="text-sm lg:text-xl hover:text-neutral-900"
          />
        </button>
      </div>

      <ConfirmDialog></ConfirmDialog>
      <!-- Добавьте столько заметок, сколько нужно -->
    </div>
  </ClientOnly>
</template>

<style lang="scss" scoped>
/* Стили для каждой заметки */
.note {
  break-inside: avoid;
  margin-bottom: 1rem;
  background-color: var(--secondary-color);
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .tasks {
    &__item {
      display: flex;
      align-items: center;
    }

    &__checkbox {
      width: 15px;
      height: 15px;
      flex-basis: 15px;
      padding: 10px;

      @media (min-width: 640px) {
        height: 25px;
        flex-basis: 25px;
      }
    }
  }
}

/* Заголовок заметки */
.note-title {
  font-size: 18px;
  font-weight: bold;
}

.note .btn {
  transition: opacity .5s, transform .5s;
}

.note:hover .btn {
  opacity: 1;

  &:hover {
    transform: scale(1.25)
  }
}

/* Список задач */
.tasks {
  list-style: none;
}

.tasks li {
  flex: 0 0 15px;
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
  display: flex;
  align-items: stretch;
}

.tasks li:last-child {
  margin-bottom: 0;
  /* Убираем отступ для последнего элемента */
}
</style>