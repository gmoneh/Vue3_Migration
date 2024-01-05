import {WatchOptions} from "vue";
import {Observable} from "rxjs";
import {BvModal, BvToast} from "bootstrap-vue";

export type Observables = Record<string, Observable<any>>
export interface WatchObservable<T> {
    newValue: T
    oldValue: T
}


declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $observables: Observables;
        $watchAsObservable(expr: string, options?: WatchOptions): Observable<WatchObservable<any>>
        $watchAsObservable<T>(fn: (this: this) => T, options?: WatchOptions): Observable<WatchObservable<T>>
        $eventToObservable(event: string): Observable<{name: string, msg: any}>
        $subscribeTo<T>(
            observable: Observable<T>,
            next: (t: T) => void,
            error?: (e: any) => void,
            complete?: () => void): void
        $fromDOMEvent(selector: string | null, event: string): Observable<Event>
        $createObservableMethod(methodName: string): Observable<any>

    }
}