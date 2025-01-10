import { defineStore } from "pinia";
import { ref } from 'vue'

export const useModalStore = defineStore('modalStore', () => {
    const isModalVisible = ref(false);
    const modalData = ref(null);
    const modalType = ref(null);

    const openModal = (type, data = null) => {
        modalType.value = type;
        isModalVisible.value = true;
        modalData.value = data;
    }

    const closeModal = () => {
        isModalVisible.value = false;
        modalData.value = null;
    }

    return {
        isModalVisible,
        modalData,
        modalType,
        openModal,
        closeModal
    }
})