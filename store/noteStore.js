import { defineStore } from "pinia";
import { useLocalStorageStore } from "./localStorageStore";
import { ref, watch, toRaw } from "vue";
import { useToast } from "vue-toastification";

export const useNoteStore = defineStore("notes", () => {
    // 1. Инициализация зависимостей
    const localStorageStore = useLocalStorageStore();

    // 2. Реактивные переменные
    const notesData = ref([
        {
            id: 1,
            title: "List #1",
            tasks: [
                {
                    id: 101,
                    text: "New Task",
                    isCompleted: false,
                },
            ],
        },
    ]);
    const currentNote = ref({});
    const toast = useToast();
    const currentStep = ref(-1);
    const history = ref([]);

    // 3. Вычисляемые свойства
    const todosListsCount = computed(() => notesData.value.length);
    const completedTodosCount = computed(() =>
        notesData.value.reduce((acc, note) => {
            return acc + note.tasks.filter((task) => task.isCompleted).length;
        }, 0)
    );
    const numberOfTasks = computed(() =>
        notesData.value.reduce((acc, note) => {
            return acc + note.tasks.length;
        }, 0)
    );

    // 4. Методы
    const loadNotesFromLocalStorage = () => {
        const storedNotes = localStorageStore.getFromLocalStorage("notes");
        console.log("storedNotes: ", storedNotes);

        if (Array.isArray(storedNotes)) {
            notesData.value = storedNotes;
        } else {
            console.warn("Invalid data in localStorage, resetting to default");
            // notesData.value = [];
        }
    };

    const saveNotesToLocalStorage = () => {
        localStorageStore.saveToLocalStorage("notes", notesData.value);
    };

    const init = () => {
        loadNotesFromLocalStorage();
    };

    const prepareNoteForEditing = (noteId) => {
        if (noteId) {
            const note = notesData.value.find((note) => note.id === noteId);
            if (note) {
                currentNote.value = JSON.parse(JSON.stringify(note));
                updateNote(currentNote.value);
            }
        }
    };

    const createNewNote = () => {
        currentNote.value = {
            id: null,
            title: "",
            tasks: [],
        };
    };

    const generateNoteId = () => {
        return notesData.value.length > 0
            ? notesData.value[notesData.value.length - 1].id + 1
            : 1;
    };

    const deleteNote = (noteId) => {
        notesData.value = notesData.value.filter((note) => note.id !== noteId);
        saveNotesToLocalStorage();
        toast.success("Deleted", {
            position: "bottom-center"
        });
    };

    const saveNote = () => {
        loadNotesFromLocalStorage();

        const noteIndex = notesData.value.findIndex(
            (note) => note.id === currentNote.value.id
        );

        if (noteIndex > -1) {
            notesData.value[noteIndex] = JSON.parse(
                JSON.stringify(currentNote.value)
            );
        } else {
            currentNote.value.id = generateNoteId();
            notesData.value.push(currentNote.value);
        }

        saveNotesToLocalStorage();
        toast.success("Saved", {
            position: "bottom-center"
        });
    };

    const updateNote = (newContent) => {
        if (currentStep.value < history.value.length - 1) {
            if (
                JSON.stringify(currentNote.value) !==
                JSON.stringify(history.value[history.value.length - 1])
            ) {
                history.value = history.value
                    .slice(0, currentStep.value + 1)
                    .map((item) => JSON.parse(JSON.stringify(item)));
                // currentStep.value++;
                console.log("currentStep IF: ", currentStep.value);
                console.log("history IF: ", toRaw(history.value));
            }
        }

        if (
            JSON.stringify(currentNote.value) !==
            JSON.stringify(history.value[history.value.length - 1])
        ) {
            history.value.push(JSON.parse(JSON.stringify(newContent)));
            currentStep.value++;
        }
    };

    const createNewTask = () => {
        const newTask = {
            id: null,
            text: "",
            isCompleted: false,
        };
        currentNote.value.tasks.push(newTask);
        currentNote.value.tasks.forEach((todo, index) => {
            console.log("currentNoteTasks: ", todo);

            todo.id = generateTaskId(currentNote.value.id, index);
        });
    };

    const updateTask = (taskId, updatedTask) => {
        const taskIndex = currentNote.value.tasks.findIndex(
            (task) => task.id === taskId
        );
        if (taskIndex !== -1) {
            currentNote.value.tasks[taskIndex] = {
                ...currentNote.value.tasks[taskIndex],
                ...updatedTask,
            };
        }
    };

    const deleteTask = (taskId) => {
        currentNote.value.tasks = currentNote.value.tasks.filter(
            (task) => task.id !== taskId
        );
    };

    const generateTaskId = (noteId, index) => {
        console.log("NoteId", noteId);
        console.log("index", index);

        return `${noteId}_${index + 1}`;
    };

    const resetHistory = () => {
        history.value = [];
        currentStep.value = -1;
    };

    const undo = () => {
        if (currentStep.value > 0) {
            currentStep.value--;
            currentNote.value = JSON.parse(
                JSON.stringify(history.value[currentStep.value])
            );
        }
    };

    const redo = () => {
        if (currentStep.value < history.value.length - 1) {
            currentStep.value++;
            currentNote.value = history.value[currentStep.value];
        }
    };

    // 5. Логика
    // 6. Хуки
    onMounted(() => {
        loadNotesFromLocalStorage();
    });

    // 7. Вспомогательные функции
    watch(
        currentNote,
        (newNote, oldNote) => {
            if (JSON.stringify(oldNote) === JSON.stringify(newNote)) {
                updateNote(newNote);
            }
        },
        { deep: true }
    );
    watch(
        notesData,
        (newNote) => {
            if (newNote) {
                prepareNoteForEditing(
                    "prepareNoteForEditing: ",
                    currentNote.value.id
                );
            }
        },
        { deep: true }
    );

    // 8. Вспомогательные компоненты

    return {
        // 9. Экспорт компонентов
        // 10. Экспорт переменных
        notes: notesData,
        currentNote,
        currentStep,
        history,
        todosListsCount,
        completedTodosCount,
        numberOfTasks,
        // 11. Экспорт функций
        init,
        deleteTask,
        createNewTask,
        generateNoteId,
        createNewNote,
        updateTask,
        deleteNote,
        loadNotesFromLocalStorage,
        saveNote,
        prepareNoteForEditing,
        updateNote,
        undo,
        redo,
        resetHistory,
        // 12. Экспорт хуков
        // 13. Экспорт констант
        // 14. Экспорт типов
        // 15. Экспорт прочего
    };
});
