<script setup>
import { useNoteStore } from "~/store/noteStore";

definePageMeta({
    layout: "note",
    name: 'Note',
})
const route = useRoute();
const id = ref(route.params.id);

const noteStore = useNoteStore();
onMounted(async () => {
    await noteStore.loadNotesFromLocalStorage();
    prepareNote();
})

const prepareNote = () => {
    const isValidId = !isNaN(Number(id.value));
    console.group('prepareNote')
    console.log('isValidId:', isValidId);
    console.log('id:', id.value);
    
    
    if (isValidId) {
        noteStore.resetHistory();
        noteStore.prepareNoteForEditing(Number(id.value));
        console.log('prepareNoteForEditign');
        
    } else {
        noteStore.createNewNote();
        console.log('id is NaN: createNewNote');
    }
    console.log('currentNote:', noteStore.currentNote);
    console.groupEnd();
}

const noteTitle = computed({
    get: () => noteStore.currentNote.title
});

const tasks = computed({
    get: () => noteStore.currentNote.tasks,
    set: (value) => noteStore.currentNote.tasks = value
});

const createNewTask = () => {
    noteStore.createNewTask();

    nextTick(() => {
        const lastTaskInput = document.querySelector(".task:last-of-type .task__text");
        if (lastTaskInput) {
            lastTaskInput.focus();
        }
    });
}

useHead({
  title: `Note: ${noteTitle.value || 'Untitled'}`,
  meta: [
    { name: 'description', content: 'My amazing site.' }
  ],
  bodyAttrs: {
    class: 'test'
  },
  script: [ { innerHTML: 'console.log(\'Hello world\')' } ]
})

watchEffect(() => {
    useHead({
    title: `Note: ${noteTitle.value || 'Untitled'}`, // Подставляем "Untitled", если title еще не загружен
    meta: [
      { name: 'description', content: 'My amazing site.' }
    ]
  });
})
</script>

<template>
    <ClientOnly>
        <div class="note container mx-auto">
            <h2 class="note__title text-sm">Tasks:</h2>
            <form submit.prevent="noteStore.saveNote">
                <div
                    v-for="task in tasks"
                    :key="task.id"
                    class="task"
                >
                    <div class="task__content">
                        <input
                            type="checkbox"
                            :id="'task-' + task.id"
                            v-model="task.isCompleted"
                            class="checkbox task__checkbox"
                        />
                        <input
                            type="text"
                            v-model="task.text"
                            placeholder="New Task"
                            :class="{ 'completed': task.isCompleted }"
                            :id="'text-' + task.id"
                            class="task__text my-2 bg-transparent outline-0"
                        />
                    </div>
                    <button
                        type="button"
                        class="btn task__btn self-center p-3 opacity-0 ms-auto"
                        @click="noteStore.deleteTask(task.id)"
                    >
                        <Icon
                            name="solar:trash-bin-minimalistic-2-broken"
                            class="text-lg text-amber-500 hover:text-red-500"
                        />
                    </button>
                </div>
                <button
                    type="button"
                    @click="createNewTask()"
                    class="btn p-3 my-4 hover:text-amber-500"
                >Create new task</button>
            </form>

        </div>
    </ClientOnly>
</template>

<style lang="scss" scoped>
.note {
    font-size: 24px;
    font-weight: 400;
    color: #000;
    margin-top: 1.5rem;
}

.task {
    display: flex;
    gap: 10px;

    &:hover {
        .task__content {
            background: #f9f4ec;
            color: rgb(249, 153, 8);
        }

        .btn {
            opacity: 1;
            background-color: transparent;
        }

    }

    &:focus-within {
        .task__content {
            background: #f9f4ec;
        }
    }

    &__content {
        flex: 1 0 auto;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 .5rem;
        transition: background .3s, color .3s;
        border-radius: 8px;

    }


    &__checkbox {
        flex: 0 0 25px;
        margin-right: .25rem;

        &:focus-visible {
            border: 1px solid rgb(var(--primary-color));
            outline: none;
        }
    }

    &__text {
        font-size: .5em;
        flex: 1 1 auto;

        @media (min-width: 640px) {
            font-size: 20px;
        }
    }

    .task__btn {
        flex: 0 0 10px;
    }


}
</style>
