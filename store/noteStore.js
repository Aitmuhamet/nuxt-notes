    import { defineStore } from "pinia";
    import { useLocalStorageStore } from "./localStorageStore";
    import { ref, watch, toRaw } from "vue";

    export const useNoteStore = defineStore("notes", () => {
        const notesData = ref([
            {
                id: 1,
                title: "Note #1",
                tasks: [
                    {
                        id: 101,
                        text: "New Task",
                        isCompleted: false,
                    },
                ],
            },
        ]);

        const localStorageStore = useLocalStorageStore();

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

        const currentNote = ref({});
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
                currentNote.value.tasks.forEach((todo, index) => {
                    todo.id = generateTaskId(currentNote.value.id, index);
                });
                notesData.value.push(currentNote.value);
            }

            saveNotesToLocalStorage();
        };

        const generateNoteId = () => {
            return notesData.value.length > 0
                ? notesData.value[notesData.value.length - 1].id + 1
                : 1;
        };
        const generateTaskId = (noteId, index) => {
            return `${noteId}_${index + 1}`;
        };

        const currentStep = ref(-1);
        const history = ref([]);

        const updateNote = (newContent) => {
            // console.group("Update note:");
            // console.log("currentNote IN: ", toRaw(currentNote.value));
            // console.log("history IN: ", toRaw(history.value));
            // console.log("currentStep IN: ", currentStep.value);
            
            // console.group("if");
            if (currentStep.value < history.value.length - 1) {
                // console.log("(I.) currentStep.value < history.value.length - 1", currentStep.value < history.value.length - 1);
                
                // console.log('1. currentNote.value === history.value[currentStep.value + 1]: ', 
                //     JSON.stringify(currentNote.value) === JSON.stringify(history.value[currentStep.value + 1]));
                // console.log('currentNote.value: ', JSON.stringify(currentNote.value));
                // console.log('history.value[currentStep.value + 1]: ', JSON.stringify(history.value[currentStep.value + 1]));
                    
                if (JSON.stringify(currentNote.value) !== JSON.stringify(history.value[history.value.length - 1])) {
                    history.value = history.value.slice(0, currentStep.value + 1).map((item) => JSON.parse(JSON.stringify(item)));
                    // currentStep.value++;
                    console.log("currentStep IF: ", currentStep.value);
                    console.log("history IF: ", toRaw(history.value));
                }

                // console.log('2. currentNote.value === history.value[currentStep.value]: ', 
                //     JSON.stringify(currentNote.value) === JSON.stringify(history.value[currentStep.value]));
                // console.log('currentNote.value: ', JSON.stringify(currentNote.value));
                // console.log('history.value[currentStep.value]: ', JSON.stringify(history.value[currentStep.value]));
            
            } 

            // console.log("(II.) currentStep.value === history.value.length - 1", currentStep.value !== history.value.length - 1);
            // console.log('1. currentNote.value !== history.value[history.value.length - 1]: ', 
                // JSON.stringify(currentNote.value) !== JSON.stringify(history.value[history.value.length - 1]));
            // console.log('currentNote.value: ', JSON.stringify(currentNote.value));
            // console.log('history.value[history.value.length - 1]: ', JSON.stringify(history.value[history.value.length - 1]));
            
            if (JSON.stringify(currentNote.value) !== JSON.stringify(history.value[history.value.length - 1])) {
                history.value.push(JSON.parse(JSON.stringify(newContent)));
                // console.log('history.push(newContent)', history.value);
                currentStep.value++;
                // console.log('currentStep++', currentStep.value);
                
            }

            // console.groupEnd();
            
            // console.log("currentNote OUT: ", toRaw(currentNote.value));
            // console.log("history OUT: ", toRaw(history.value));
            // console.log("currentStep OUT: ", currentStep.value);
            // console.groupEnd();
            
        };


        const undo = () => {
            // console.group("Undo");
            // console.log("currentStep IN:", currentStep.value);
            
            if (currentStep.value > 0) {
                currentStep.value--;
                currentNote.value = JSON.parse(JSON.stringify(history.value[currentStep.value]));
            }
            // console.log("currentStep OUT:", currentStep.value);
            // console.groupEnd();
        };

        const redo = () => {
            // console.group("Redo:");
            // console.log("currentStep IN:", currentStep.value);
            // console.log("currentNote IN:", currentNote.value);
            
            if (currentStep.value < history.value.length - 1) {
                currentStep.value++;
                currentNote.value = history.value[currentStep.value];
            }
            // console.log("currentStep OUT:", currentStep.value);
            // console.log("currentNote OUT:", currentNote.value);
            // console.groupEnd();
        };

        const resetHistory = () => {
            // console.group("Reset History");
            // console.log("history: IN", toRaw(history.value));
            // console.log("currentStep: IN", currentStep.value);

            history.value = [];
            currentStep.value = -1;
            // console.log("currentNote: ", toRaw(currentNote.value));
            // console.log("history: OUT", toRaw(history.value));
            // console.log("currentStep: OUT", currentStep.value);
            // console.groupEnd();
        };

        watch(
            currentNote,
            (newNote, oldNote) => {
                console.group('watch: currentNote IN')
                console.log("newNote: ", toRaw(newNote));
                console.log("oldNote: ", toRaw(oldNote));
                console.log("currentNote: ", toRaw(currentNote.value));
                console.log("history: ", toRaw(history.value));
                console.log("currentStep: ", currentStep.value);

                // console.log("JSON.stringify(oldNote) === JSON.stringify(newNote)): ", JSON.stringify(oldNote) === JSON.stringify(newNote));
                // console.log("JSON.stringify(history.value[currentStep.value]: ", JSON.stringify(history.value[currentStep.value]));
                // console.log("JSON.stringify(newNote)): ", JSON.stringify(newNote));
                console.groupEnd();

                if (JSON.stringify(oldNote) === JSON.stringify(newNote)) {
                    // Запускаю updateNote, когда вносятся изменения в Note вручную
                    updateNote(newNote);
                    // Нужно условие, которое проверяет не является ли новое значение currentNote на то, не является оно предыдущим значением currentNote
                }
                console.group("watch: currentNote OUT");
                console.log("currentNote: ", toRaw(currentNote.value));
                console.log("history: ", toRaw(history.value));
                console.log("currentStep: ", currentStep.value);
                console.groupEnd();
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

        onMounted(() => {
            loadNotesFromLocalStorage();
            // resetHistory();
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
