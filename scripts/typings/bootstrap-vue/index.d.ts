import { BvTableField as original } from 'bootstrap-vue';

declare module 'bootstrap-vue/src/components/table' {
    
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
