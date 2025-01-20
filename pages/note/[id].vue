<script setup>
import { useNoteStore } from "~/store/noteStore";
// 1. Метаинформация
definePageMeta({
    layout: "note",
    name: 'Note',
})

// 1. Инициализация зависимостей
const route = useRoute();
const noteStore = useNoteStore();

// 2. Реактивные перменные
const id = ref(route.params.id);

// 3. Вычисляемые свойства
const noteTitle = computed({
    get: () => noteStore.currentNote.title
});

const tasks = computed({
    get: () => noteStore.currentNote.tasks,
    set: (value) => noteStore.currentNote.tasks = value
});


// 4. Методы
function prepareNote() {
    const isValidId = !isNaN(Number(id.value));
    if (isValidId) {
        noteStore.resetHistory();
        noteStore.prepareNoteForEditing(Number(id.value));

    } else {
        noteStore.createNewNote();
    }
}

function createNewTask() {
    noteStore.createNewTask();

    nextTick(() => {
        const lastTaskInput = document.querySelector(".task:last-of-type .task__text");
        if (lastTaskInput) {
            lastTaskInput.focus();
        }
    });
}

// 5. Сайд-эффекты
onMounted(async () => {
    await noteStore.loadNotesFromLocalStorage();
    prepareNote();
})

// 6. Дополнительные подписки
watchEffect(() => {
    useHead({
        title: `List: ${noteTitle.value || '_'}`, // Подставляем "Untitled", если title еще не загружен
        meta: [
            { name: 'description', content: 'My amazing site.' }
        ]
    });
})

useHead({
    title: `List: ${noteTitle.value || '_'}`,
    meta: [
        { name: 'description', content: 'List Edit page.' }
    ],
    bodyAttrs: {
        class: 'test'
    },
    script: [{ innerHTML: 'console.log(\'Hello world\')' }]
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
                        aria-label="Delete Task"
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
                    aria-label="Create New Task"
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

    * {
        transition: scale .3s, filter .3s;
    }
    &:has(:hover) :not(:hover) {
        scale: 0.95;
        filter: blur(2px);
    }

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
        }
    }

    &__text {
        font-size: .5em;
        flex: 1 1 auto;
        align-self: center;
        height: 100%;

        @media (min-width: 640px) {
            font-size: 20px;
        }

    }

    &__btn {
        flex: 0 0 10px;

        &:focus {
            opacity: 1;
            transform: scale(1.4);
            outline: none;
            background-color: transparent;
        }
    }

}
</style>
