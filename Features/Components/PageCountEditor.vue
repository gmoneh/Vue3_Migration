<template>
    <form style="margin: 10px; width: 200px;">
        <b-form-group id="input-group-2" label="Your Name:" label-for="input-2">
            <template #label>
                <label v-lsi-required-icon v-lsi-help-icon="1200">Page Count</label>
            </template>
            <b-form-input
                id="txtPageCount"
                v-model="pages"
                placeholder="Enter page count"
                required
            ></b-form-input>
        </b-form-group>
    </form>
</template>

<script lang="ts">
import {Vue, Component, Prop, Setup} from 'vue-facing-decorator';
import { useTitleStore } from "@Store/TitleStore";

@Component({
    components: {}
})
export default class PageCountEditor extends Vue {

    @Setup(() => useTitleStore())
    titleStore!: ReturnType<typeof useTitleStore>;

    get pages() {
        return this.titleStore.title? this.titleStore.title.pageCount : "";
    }

    set pages (val: string) {
        if (!this.titleStore.title) {
            this.titleStore.fetchTitle();
        }
        this.titleStore.title!.pageCount = Number.parseInt(val);
    }

}
</script>
