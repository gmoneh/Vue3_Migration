<template>
    <div>
    <b-button @click="onShowModal" >Show Modal</b-button>
    </div>
    <b-modal id="modal-1" title="BootstrapVue">
        <p class="my-4">The title is {{ titleStore.title!.title }}</p>
    </b-modal>
</template>

<script lang="ts">
import {Vue, Component, Prop, Setup} from 'vue-facing-decorator';
import { useTitleStore } from "@Store/TitleStore";
import {BvTableField, BModalScope } from "bootstrap-vue";
import { ComponentCustomProperties } from "vue";


@Component({
    components: {}
})
export default class ShowModal extends Vue {

    @Setup(() => useTitleStore())
    titleStore!: ReturnType<typeof useTitleStore>;

    onShowModal() {
        this.titleStore.fetchTitle();
        (this as ComponentCustomProperties).$bvModal.show("modal-1");
        this.$pinia.use(() => {})
        this.$watchAsObservable('titleStore');
        let f: BvTableField;
        f = {
            sortable: true,
            sortExpression: ''
        }
        this.$eventToObservable('event');
        let s: BModalScope = {
            hide: () => {},
            cancel: () => {}
        }
    }

}
</script>
