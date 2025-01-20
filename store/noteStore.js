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
        // 4. Методы
        const loadNotesFromLocalStorage = () => {
            const storedNotes = localStorageStore.getFromLocalStorage("notes");
            console.log('storedNotes: ', storedNotes);
            
            if (Array.isArray(storedNotes)) {
                notesData.value = storedNotes;
            } else {
                console.warn("Invalid data in localStorage, resetting to default");
                // notesData.value = [];
            }
        };

        const init = () => {
            loadNotesFromLocalStorage()
        }

        const saveNotesToLocalStorage = () => {
            localStorageStore.saveToLocalStorage("notes", notesData.value);
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

        const createNewTask = () => {
            const newTask = {
                id: null,
                text: "",
                isCompleted: false,
            };
            currentNote.value.tasks.push(newTask);
            currentNote.value.tasks.forEach((todo, index) => {
                console.log('currentNoteTasks: ', todo);
                
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


        const deleteNote = (noteId) => {
            notesData.value = notesData.value.filter((note) => note.id !== noteId);
            saveNotesToLocalStorage();
            toast.success('Deleted')
        };

        const deleteTask = (taskId) => {
            currentNote.value.tasks = currentNote.value.tasks.filter(
                (task) => task.id !== taskId
            );
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
            toast.success('Saved')
        };

        const generateNoteId = () => {
            return notesData.value.length > 0
                ? notesData.value[notesData.value.length - 1].id + 1
                : 1;
        };
        const generateTaskId = (noteId, index) => {
            console.log('NoteId', noteId);
            console.log('index', index);
            
            return `${noteId}_${index + 1}`;
        };

        const updateNote = (newContent) => {
            if (currentStep.value < history.value.length - 1) {
                    
                if (JSON.stringify(currentNote.value) !== JSON.stringify(history.value[history.value.length - 1])) {
                    history.value = history.value.slice(0, currentStep.value + 1).map((item) => JSON.parse(JSON.stringify(item)));
                    // currentStep.value++;
                    console.log("currentStep IF: ", currentStep.value);
                    console.log("history IF: ", toRaw(history.value));
                }
            } 

            if (JSON.stringify(currentNote.value) !== JSON.stringify(history.value[history.value.length - 1])) {
                history.value.push(JSON.parse(JSON.stringify(newContent)));
                currentStep.value++;
            }
        };


        const undo = () => {
            if (currentStep.value > 0) {
                currentStep.value--;
                currentNote.value = JSON.parse(JSON.stringify(history.value[currentStep.value]));
            }
        };

        const redo = () => {
            if (currentStep.value < history.value.length - 1) {
                currentStep.value++;
                currentNote.value = history.value[currentStep.value];
            }
        };

        const resetHistory = () => {
            history.value = [];
            currentStep.value = -1;
        };

        // 5. Сайд-эффекты
        onMounted(() => {
            loadNotesFromLocalStorage();
        });
        
        // 6. Дополнительные подписки
        watch(
            currentNote,
            (newNote, oldNote) => {
                if (JSON.stringify(oldNote) === JSON.stringify(newNote)) {
                    // Запускаю updateNote, когда вносятся изменения в Note вручную
                    updateNote(newNote);
                    // Нужно условие, которое проверяет не является ли новое значение currentNote на то, не является оно предыдущим значением currentNote
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
        watch(currentStep, (newStep) => {
            if (newStep) {
                // console.log('currentStep: ', currentStep.value);
            }
        });

        return {
            notes: notesData,
            currentNote,
            currentStep,
            history,
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
        };
    });
