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
                <div v-if="modalType === 'confirmDelete'">
                    <p class="text-center text-4xl mt-2">Delete note: <span class="p-1 bg-lime-100 rounded">{{ modalData.title
                            }}</span> ?</p>
                    <div class="flex justify-center mt-6">
                        <button
                            @click="confirmDelete(modalData.id)"
                            class="btn text-lg p-3 mx-3 w-20 "
                        >Yes</button>
                        <button
                            @click="closeModal"
                            class="btn text-lg p-3 mx-3 w-20 "
                        >No</button>
                    </div>
                </div>
                <div v-else-if="modalType === 'comfirmDiscardChanges'">
                    <p class="text-center mt-2 text-4xl">Cancel changes?</p>
                    <div class="flex justify-center mt-6">
                        <button
                            @click="confirmDiscardChanges"
                            class="btn text-lg p-3 m-3 w-20 "
                        >Yes</button>
                        <button
                            @click="closeModal"
                            class="btn text-lg p-3 m-3 w-20 "
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
    background: white;
    padding: 50px;
    border-radius: 5px;
}
</style>