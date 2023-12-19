import { ref, reactive } from "vue";
import { defineStore } from 'pinia'
import { title } from "@Models/models";

export const useTitleStore = defineStore(
    'titles',
    () => {
        let title= ref<title | null>(null);

        function fetchTitle() {
            title.value = {
                title: 'My First Title',
                subtitle: 'A Title',
                pageCount: 50
            };
        }

        return {
            title,
            fetchTitle
        };
    }
);

