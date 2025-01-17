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
        <h3 class="note__title p-2 md:p-4 text-slate-500  flex justify-between items-center">
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
            <p class="tasks__text">
              {{ task.text }}
            </p>
          </li>
        </ul>
        <button
          class="btn note__btn w-8 h-8 p-0.5 absolute bottom-1 right-1 opacity-0"
          @click.stop="deleteNote(note)"
          type="button"
        >
          <Icon
            name="solar:trash-bin-minimalistic-2-broken"
            class="text-sm lg:text-xl hover:text-amber-500"
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
  border: 1px solid rgb(var(--primary-color), .5);
  border-radius: 8px;

  &__title {
    transition: background-color .3s, color .3s;
    font-size: 1.5rem;
    font-weight: 600;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
  }

  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .note__title {
      background-color: rgb(251 146 60);
      color: rgb(230, 228, 228);
    }
  }

  .tasks {
    &__item {
      display: flex;
      align-items: center;
    }

    &__text {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      text-overflow: ellipsis;
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
  transition: opacity .2s, transform .2s;
}

.note:hover .btn {
  opacity: 1;

  &:hover {
    transform: scale(1.5)
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