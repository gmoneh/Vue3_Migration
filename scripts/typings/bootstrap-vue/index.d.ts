import { BvTableField as original, BvModal, BvToast } from 'bootstrap-vue';

declare module 'bootstrap-vue' {

    interface BvTableField {
        sortExpression?: string
    }
}

declare module 'bootstrap-vue/src/components/modal' {

    interface BModalScope {
        cancel: Function;
        close: Function;
        hide: Function;
        ok: Function;
        visible: Boolean;
    }
}

// TODO: figure out why it cannot be 'vue'
// @ts-ignore: works on Vue 3, fails in Vue 2
declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        /**
         * BootstrapVue extensions
         */

        readonly $bvModal: BvModal
        readonly $bvToast: BvToast
    }
}
