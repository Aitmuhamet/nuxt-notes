<script setup lang="ts">
import { computed } from 'vue';
import { useModalStore } from '~/store/modalStore';
const modalStore = useModalStore();

import { useNoteStore } from '~/store/noteStore';
const noteStore = useNoteStore();

const isModalVisible = computed(() => modalStore.isModalVisible);
const modalData = computed(() => modalStore.modalData);
const modalType = computed(() => modalStore.modalType)

const router = useRouter();

const confirmDelete = (noteId) => {
    console.log('noteId: ', noteId);

    noteStore.deleteNote(noteId);
    noteStore.resetHistory();
    modalStore.closeModal();
    router.push('/')
}

const confirmDiscardChanges = () => {
    noteStore.resetHistory();
    modalStore.closeModal();
    router.push('/');
}

const closeModal = modalStore.closeModal;
</script>

<template>
    <teleport to='#teleports'>
        <div
            v-if="isModalVisible"
            class="modal"
            @click="closeModal"
        >
            <div class="modal-content">
                <div
                    v-if="modalType === 'confirmDelete'"
                    class="flex flex-col"
                >
                    <p class="text-center text-4xl mt-2">Delete note?</p>
                    <p class="p-1 mt-4 bg-lime-100 rounded self-center">
                        {{ modalData.title }}
                    </p>
                    <div class="flex justify-center mt-6">
                        <button
                            @click="confirmDelete(modalData.id)"
                            class="btn text-lg mx-3 w-20 "
                        >Yes</button>
                        <button
                            @click="closeModal"
                            class="btn text-lg mx-3 w-20 "
                        >No</button>
                    </div>
                </div>
                <div v-else-if="modalType === 'comfirmDiscardChanges'">
                    <p class="text-center mt-2 text-4xl">Cancel changes?</p>
                    <div class="flex justify-center mt-6">
                        <button
                            @click="confirmDiscardChanges"
                            class="btn text-lg m-3 w-20 "
                        >Yes</button>
                        <button
                            @click="closeModal"
                            class="btn text-lg m-3 w-20 "
                        >No</button>
                    </div>
                </div>

                <!-- <slot :data="modalData"></slot> -->
            </div>
        </div>
    </teleport>
</template>

<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100dvh;
    z-index: 299;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
}

.modal-content {
    -webkit-box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
    -moz-box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
    box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
    border: 1px solid rgba(var(--primary-color), 1);
    background: white;
    padding: 50px 100px;
    border-radius: 10px;
}

.btn {
    padding: 0.75rem 3.5rem;
}
</style>