<template>
    <div
      translate="no"
      class="notes-container container mx-auto gap-4 h-full hover:cursor-pointer"
    >
      <div
        class="note pb-6 hover:scale-[1.03] transition-transform duration-300 ease-in-out relative"
        v-for="(note) in noteStore.notes"
        :key="note.id"
        @click="navigateWithReset(note.id)"
        tabindex="0"
      >
        <h3 class="note__title p-2 md:p-4 text-slate-500  flex justify-between items-center">
          {{ note.title }}
        </h3>
        <ul class="tasks m-2 md:m-4 text-slate-200 flex flex-col items-stretch">
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
          aria-label="Delete Note"
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
</template>

<script setup>
import { useNoteStore } from '~/store/noteStore';
import { useModalStore } from '~/store/modalStore';
import ConfirmDialog from '~/components/ConfirmDialog.vue';

// Метаинформация
useHead({
  title: `Lists`, // Подставляем "Untitled", если title еще не загружен
  meta: [
    { name: 'description', content: 'All lists in the site.' }
  ]
});

// 1. Инициализация зависимостей
const noteStore = useNoteStore();
const modalStore = useModalStore();
const router = useRouter();

// 2. Реактивные переменные
// 3. Вычисляемые свойства
// 4. Методы
const navigateWithReset = (id) => {
  noteStore.resetHistory();
  router.push(`/note-${id}`);
}

const deleteNote = (note) => {
  modalStore.openModal('confirmDelete', note);
}

const first3Tasks = (tasks) => {
  return tasks.slice(0, 3);
}

// 5. Сайд-эффекты
onMounted(() => {
  noteStore.loadNotesFromLocalStorage();
})

// 6. Допольнительные подписки
</script>

<style lang="scss" scoped>
.notes-container {
  display: grid;
}

.note {
  break-inside: avoid;
  margin-bottom: 1rem;
  background-color: var(--secondary-color);
  border: 1px solid rgba(var(--primary-color), 1);
  border-radius: 8px;

  height: auto;
  max-height: 250px; // Устанавливаем предел высоты
  overflow: hidden;

  &:hover,
  &:focus,
  &:active {
    -webkit-box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
    -moz-box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
    box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
    border: 1px solid rgb(var(--bg-color), .5);
    z-index: 49;
    outline: none;

    .note__title {
      background-color: rgba(251, 146, 60, .8);
      color: rgb(31, 30, 30);
    }

    .tasks__text {
      color: rgb(31, 30, 30);
    }
  }

  &__title {
    transition: background-color .3s, color .3s;
    font-size: 1.5rem;
    font-weight: 600;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    padding: .5rem 1rem;
    max-height: 4rem;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
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
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: normal;
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
    transform: scale(1.5) translate(-5px, -5px);
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

@media (min-width: 640px) {
  .notes-container {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: .75rem 3rem;
  }
}

@media (min-width: 768px) {
  .notes-container {
    gap: .75rem 1.5rem;
  }

  .note {
    min-height: 215px;
  }
}

@media (min-width: 1024px) {
  .note {
    min-height: 215px;
  }
}

@media (min-width: 1280px) {}

@media (min-width: 1736px) {}
</style>