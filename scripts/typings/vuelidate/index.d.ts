// Type definitions for vuelidate 0.7
// Project: https://github.com/monterail/vuelidate
// Definitions by: Jan Esser <https://github.com/janesser>
//                 Jubair Saidi <https://github.com/jubairsaidi>
//                 Orblazer <https://github.com/orblazer>
//                 Yuri Krylov <https://github.com/shadrus>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 4.4
declare module 'vuelidate/lib/validators'
{
    import Vue from 'vue'

    export interface Params {
        [key: string]: any,
        type: string
    }

    export interface ValidationParams {
        readonly name: string
        readonly params: Params
        readonly path: string[]
    }

    // const ValidationRule
    export interface ValidationRule {
        (...params: any[]): boolean
        $params(): ValidationParams
        $pending(): boolean
    }

    export type CustomRule = (value: any, parentVm?: any) => boolean | Promise<boolean>

    export type ValidationFunc = () => ValidationRule;

    export interface Helpers {
        withParams(params: Params, rule: CustomRule | ValidationRule): ValidationRule
        req(value: any): boolean
        ref(reference: string | ((vm: any, parentVm?: Vue) => any), vm: any, parentVm?: Vue): any
        len(value: any): number
        regex(type: string, expr: RegExp): ValidationRule
    }

    export const helpers: Helpers

    // pre-defined rules
    export const required: ValidationRule
    export function requiredIf(field: string | ((vm: any, parentVm?: Vue) => any)): ValidationRule
    export function requiredUnless(field: string | ((vm: any, parentVm?: Vue) => any)): ValidationRule
    export function minLength(length: number): ValidationRule
    export function maxLength(length: number): ValidationRule
    export function minValue(min: number | Date): ValidationRule
    export function maxValue(max: number | Date): ValidationRule
    export function between(min: number | Date, max: number | Date): ValidationRule
    export const alpha: ValidationRule
    export const alphaNum: ValidationRule
    export const numeric: ValidationRule
    export const integer: ValidationRule
    export const decimal: ValidationRule
    export const email: ValidationRule
    export const ipAddress: ValidationRule
    export function macAddress(separator: string): ValidationRule
    export function sameAs(field: string | ((vm: any, parentVm?: Vue) => any)): ValidationRule
    export const url: ValidationRule
    export function not(validator: ValidationRule | CustomRule): ValidationRule
    export function or(...validators: Array<ValidationFunc | CustomRule>): ValidationRule
    export function and(...validators: Array<ValidationFunc | CustomRule>): ValidationRule

}



declare module 'vuelidate/vuelidate'
{
    import { ValidationParams } from 'vuelidate/lib/validators'
    import Vue, { PluginFunction } from 'vue'
    import {CustomRule, Params, ValidationRule} from "vuelidate/lib/validators";

    export type ValidationProperties<V> = {
        [P in Exclude<keyof V, '$v' | '$parent' | '$root' | '$children'>]?: Validation & ValidationProperties<V[P]> & ValidationEvaluation
    }

    export interface ValidationGroups {
        [groupName: string]: Validation & ValidationProperties<any>
    }

    export interface ValidationEvaluation {
        [ruleName: string]: boolean
    }

    /**
     * Covers beforeCreate(), beforeDestroy() and data().
     *
     * No public members.
     */
    export const validationMixin: any

// const Validation
    export interface Validation extends Vue {
        $model: any
        // const validationGetters
        readonly $invalid: boolean
        readonly $dirty: boolean
        readonly $anyDirty: boolean
        readonly $error: boolean
        readonly $anyError: boolean
        readonly $pending: boolean
        readonly $params: { [attr: string]: any }

        // const validationMethods
        $touch(): void
        $reset(): void
        $flattenParams(): ValidationParams[]
    }

// vue plugin
    export const Vuelidate: PluginFunction<any>
    export function withParams(params: Params, rule: CustomRule | ValidationRule): ValidationRule;

}

declare module 'vuelidate' {

    import {Vuelidate} from 'vuelidate/vuelidate'
    export default Vuelidate
    export {
        validationMixin,
        Validation,
        withParams
    } from 'vuelidate/vuelidate'
}