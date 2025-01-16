<script setup>
import { useNoteStore } from "~/store/noteStore";

definePageMeta({
    layout: "note",
});

const route = useRoute();
const id = ref(route.params.id);
// console.log('route in Page ID', route);
// console.log('page id', id.value);


const noteStore = useNoteStore();
onMounted(() => {
  noteStore.loadNotesFromLocalStorage(); 
  prepareNote();
})

const prepareNote = () => {
    const isValidId = !isNaN(Number(id.value));
    if (isValidId) {
        noteStore.resetHistory();
        noteStore.prepareNoteForEditing(Number(id.value));
    } else {
        noteStore.createNewNote();
        console.log('currentNote:', noteStore.currentNote);
    }
}

const tasks = computed({
    get: () => noteStore.currentNote.tasks,
    set: (value) => noteStore.currentNote.tasks = value
});

const createNewTask = () => {
    noteStore.createNewTask()
}

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
                    <button
                        type="button"
                        class="btn task__btn self-center p-3 opacity-0 ms-auto"
                        @click="noteStore.deleteTask(task.id)"
                    >
                        <Icon
                            name="solar:trash-bin-minimalistic-2-broken"
                            class="text-lg"
                        />
                    </button>
                </div>
                <button
                    type="button"
                    @click="createNewTask()"
                    class="btn p-3 my-4"
                >Create new task</button>
            </form>
    
            <!-- <pre>notes: {{ noteStore.currentNote }}</pre> -->
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
    align-items: center;
    gap: 10px;
    border-radius: 8px;
    padding: 0 .5rem;
    transition: background .3s, color .3s;

    &:hover {
        background: #f9f4ec;
        color: rgb(249, 153, 8);

        .btn {
            opacity: 1;
            background-color: transparent;
        }

    }

    &__checkbox {
        flex: 0 0 25px;
        margin-right: .25rem;
    }

    &__text {
        font-size: .5em;
        flex: 1 1 auto;

        @media (min-width: 640px) {
            font-size: 20px;
        }
    }

    &task__btn {
        flex: 0 0 10px;
    }


}
</style>
