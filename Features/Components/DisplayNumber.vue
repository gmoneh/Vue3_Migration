<template>
    <p class="portal-number">
        The number is: {{ num }}
        The other number is: {{ anotherNum }}
    </p>
    <b-button @click="onIncrement">Increment</b-button>
</template>

<script lang="ts">
import { of, interval, concat, map } from 'rxjs'
import {Vue, Component, Prop, Inject, Setup} from "vue-facing-decorator";
import { useObservable } from "@vueuse/rxjs";


export function hasNumber$() {
    let counter = 50;
    let report = concat(
        of(counter),
        interval(50000).pipe(
            map(i => {
                counter += 1;
                return counter;
            })
        )
    );
    return report;
}

@Component({
    subscriptions() {
        return {
            anotherNum: hasNumber$()
        }
    }
})
export default class DisplayNumber extends Vue {
    num: number = 0;

    @Setup(() => useObservable(hasNumber$()))
    anotherNum!: number;

    @Prop({type: Number, default: 10})
    parentNum!: number;

    onIncrement() {
        this.num += 1;
    }

    created() {
        this.num = this.parentNum;
    }

}
</script>

<style lang="scss">

.portal-number {
    font-family: "Century Gothic";
    color: pink;
}
</style>