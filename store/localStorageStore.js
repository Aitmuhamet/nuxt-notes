import { defineStore } from "pinia";

export const useLocalStorageStore = defineStore("localStorage", () => {
    const getFromLocalStorage = (key) => {
        if (import.meta.client) {
            try {
                const data = window.localStorage.getItem(key);
                return data ? JSON.parse(data) : null;
            } catch (error) {
                console.error(`Failed to parse data for key: ${key}`, error);
                return null;
            }
        }
    };

    const saveToLocalStorage = (key, value) => {
        if (import.meta.client) {
            window.localStorage.setItem(key, JSON.stringify(value));
        }
    };

    return { getFromLocalStorage, saveToLocalStorage };
});
