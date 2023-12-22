import {Component, SetupContext, withDirectives} from "vue";
import { capitalizeFirstLetter } from "@ClientApp/utils/utils";
import {
    always,
    append,
    both,
    cond,
    empty,
    equals,
    has,
    identity,
    ifElse,
    includes,
    is,
    isNil,
    lensProp,
    not,
    of,
    partial,
    pipe,
    set,
    view,
    when,
    without
} from "ramda";


export type VNodeData = Record<string, any>;
export type FunctionalComponentContext = Omit<SetupContext, 'expose'>;
export type ComponentDefFunc = () => string | Component;

export interface ICheckControlProps {
    id: string;
    name: string;
    value: string;
    checked: boolean | string | string[];
    unchecked: string;
    disabled: boolean;
}


export const CheckControlPropsDef = {
    id: String,
    name: String,
    value: String,
    checked: { type: [ String, Array, Object, Boolean ], default: false },
    unchecked: { type: String, default: ''},
    disabled: Boolean
}

type ClassesDef = string | object | (string | object)[];
type EventHandler = (event: Event) => any;
type OnChangeValue = string | string[] | boolean | null;
type OnChangeHandler = (value: OnChangeValue) => any;


export function controlName<Props extends ICheckControlProps>(props: Props)
{
    if (props.name) {
        return props.name;
    }
    else if (props.id)
    {
        return "val_" + props.id;
    }
}

export function controlId<Props extends ICheckControlProps>(props: Props)
{
    let id = "ctl_";
    if (props.id) {
        id = id + props.id
    }
    else if (props.name) {
        id = props.name;
    }
    if (props.value) {
        id = id + "_" + props.value;
    }
    return id;
}

function controlAttributes(props: ICheckControlProps, type: string, generateCheckValue: () => boolean): object {
    let attribs: any = {
        value: props.value,
        checked: generateCheckValue(),
        name: controlName(props),
        id: controlId(props),
        type: type
    };
    if (props.disabled) {
        attribs.disabled = true;
    }
    return attribs;
}

function controlModel(props: ICheckControlProps): Record<string, any>
{
    return {
        'modelValue': props.checked
    };
}

function eventPropName(eventName: string) {
    return `on${capitalizeFirstLetter(eventName)}`;
}

function replaceListener(eventName: string, newHandler: EventHandler | null, data: VNodeData): any
{
    let _eventPropName = eventPropName(eventName);
    return when(both(has(_eventPropName), always(not(isNil(newHandler)))), set(lensProp(_eventPropName), newHandler), data);
}

function generateOnChange<Props extends ICheckControlProps>(props: Props, data: VNodeData, generateValue: (checked: boolean) => OnChangeValue): EventHandler | null
{
    let listener = view(lensProp(eventPropName('change')), data) as OnChangeHandler | OnChangeHandler[];
    if (!listener) return null;
    return (event: Event) => {
        let control = event.target as HTMLInputElement;
        let eventArg = generateValue(control.checked);
        if (typeof listener === 'function') {
            listener(eventArg);
        }
        else if (Array.isArray(listener)) {
            listener.forEach(l => l(eventArg))
        }
    }
}

export function renderControl<Props extends ICheckControlProps>(
    type: string,
    props: Props,
    context: FunctionalComponentContext,
    classes: ClassesDef | undefined,
    listeners: any,
    onChangeValue: (checked: boolean) => OnChangeValue,
    checkValue: () => boolean
) {

    return <input
        class={classes}
        checked={checkValue()}
        {...{...controlAttributes(props, type, checkValue), ...controlModel(props) }}
        onChange={replaceListener('change', generateOnChange(props, props, onChangeValue), props)}
    />
}

export function renderCheckbox<Props extends ICheckControlProps>(props: Props, context: FunctionalComponentContext, classes?: ClassesDef) {
    let generateOnChangeValue = (props: Props, controlChecked: boolean) =>
        cond([
            [is(Boolean), always(controlChecked)],
            // @ts-ignore
            [is(String), ifElse(() => controlChecked,
                () => props.value,
                () => props.unchecked
            )
            ],
            // @ts-ignore: We do know that the argument is an array at this point (because of the condition)
            [is(Array), ifElse(() => controlChecked,
                // @ts-ignore
                pipe(without(of(props.value)), append(props.value)),
                without([props.value])
            )
            ]
        ])
        // @ts-ignore: props.checked can be a boolean, a string or an array
        (props.checked);
    let generateCheckValue = (props: Props) =>
        cond([
            // @ts-ignore
            [is(Boolean), identity],
            [is(String), equals(props.value)],
            // @ts-ignore
            [is(Array), includes(props.value)]
        ])(props.checked);
    // @ts-ignore
    return renderControl("checkbox",  props, classes, listeners, partial(generateOnChangeValue, [props]), partial<boolean>(generateCheckValue, [props]));
}

export function renderRadio<Props extends ICheckControlProps>(props: Props, context: FunctionalComponentContext, classes?: ClassesDef)
{
    let generateOnChangeValue = (props: Props, controlChecked: boolean) =>
        cond([
            [is(Boolean), always(controlChecked)],
            // @ts-ignore
            [is(String), ifElse(() => controlChecked,
                () => props.value,
                // @ts-ignore
                (s: string) => empty(s)
            )
            ]
        ])
        (props.checked);
    let generateCheckValue = (props: Props) =>
        cond([
            // @ts-ignore
            [is(Boolean), identity],
            // @ts-ignore
            [is(String), equals(props.value)]
        ])(props.checked);
    // @ts-ignore
    return renderControl("radio", props, classes, listeners, partial(generateOnChangeValue, [props]), partial<boolean>(generateCheckValue, [props]));
}