import Vue, { CreateElement, VNodeData, VNode, VNodeChildren, RenderContext } from 'vue';
import {Location} from "vue-router";
import { dissoc } from 'ramda';
import * as CommonProps from "./FormControlProps";

interface IVisualPickerProps {
    caption: string;
    'caption-outside': boolean;
    imageUrl: string;
    variant: string;
    size: string;
    short: boolean;
    disabled: boolean;
    naDisplay: boolean;
}

interface IVisualPickerWithControlProps extends IVisualPickerProps, CommonProps.ICheckControlProps {
}

interface IVisualLinkProps extends IVisualPickerProps {
    href: string | Location;
}

const VisualPickerPropsDef = {
    caption: String,
    'caption-outside': { type: Boolean, default: false },
    imageUrl: String,
    variant: String,
    size: String,
    short: Boolean,
    disabled: Boolean,
    naDisplay:Boolean
}

const VisualPickerWithControlPropsDef = {
    ...VisualPickerPropsDef,
    ...CommonProps.CheckControlPropsDef
}

const VisualLinkPropsDef = {
    ...VisualPickerPropsDef,
    href: [ String, Object ]
}


type RenderingDataFunction<Props extends IVisualPickerProps> = (props: Props, classes: any) => VNodeData;
type RenderingFunction<Props extends IVisualPickerProps> = (h: CreateElement, props: Props) => VNode | null;
type RenderingContentsFunction<Props extends IVisualPickerProps> = (h: CreateElement, props: Props, slots: any) => VNode | null;
type RenderingControlFunction<Props extends IVisualPickerProps> = (h: CreateElement, props: Props, listeners: any) => VNode | null;
type RenderOverlayFunction<Props extends IVisualPickerProps> = (h: CreateElement, props: Props) => VNode | null;

function defaultOuterTag() {return "div"}
function defaultInnerTag() { return "div" }

function withControlInnerTag() { return "label" }


function defaultOuterTagData<Props extends IVisualPickerProps>(props: Props, classes: any): VNodeData {
    return { class: defaultOuterClass(props, classes) };
}

function linkOuterTagData<Props extends IVisualLinkProps>(props: Props, classes: any): VNodeData {
    let data = defaultOuterTagData(props, classes);
    data.attrs = {...data.attrs, to: props.href };
    return data;
}

function defaultInnerTagData<Props extends IVisualPickerProps>(props: Props): VNodeData {
    return { class: { 'visual-picker-figure': true, disabled: props.disabled }};
}

function withControlInnerTagData<Props extends IVisualPickerWithControlProps>(props: Props): VNodeData {
    let data = defaultInnerTagData(props);
    data.attrs = {...data.attrs, 'for': CommonProps.controlId(props)}
    return data;
}

function defaultOuterClass<Props extends IVisualPickerProps>(props: Props, extraClasses: any): any {
    let outerClass: any = { 
        'visual-picker': true, 
        'has-peek-inside': props.caption && !props['caption-outside']? true : false,
        'has-peek': props.caption && props['caption-outside']? true : false
    };
    if (props.size) {
        outerClass['visual-picker-' + props.size] = true;
    }
    if (props.short) {
        outerClass['visual-picker-short'] = true;
    }
    outerClass['visual-picker-' + (props.variant || "")] = props.variant? true : false;
    if (extraClasses) {
        if (typeof extraClasses == 'string') {
            outerClass[extraClasses] = true;
        }
        else if (Array.isArray(extraClasses)) {
            outerClass = [...extraClasses, outerClass];
        }
        else if (typeof extraClasses == 'object') {
            outerClass = {...outerClass, ...extraClasses};
        }
    }
    return outerClass;
}


function renderOuterTag<Props extends IVisualPickerProps>(h: CreateElement, props: Props, listeners: any, outerTag: () => string, data: VNodeData, contents: VNodeChildren)
{
    return h(outerTag(), { ...data, on: dissoc('change', listeners) }, [ contents ]);
}

function renderInnerTag<Props extends IVisualPickerProps>(h: CreateElement, props: Props, innerTag: () => string,  data: VNodeData, contents: VNodeChildren)
{
    return h(innerTag(), data, 
        [
        <span class="visual-picker-content">
            { contents }
        </span>
        ]
    );
}

function renderPeek<Props extends IVisualPickerProps>(h: CreateElement, props: Props): VNode | null
{
    if (props.caption)
    {
        return (
            <span class={ [ 'visual-picker-peek', {disabled: props.disabled} ] }>
                {props.caption}
            </span>
        );
    }
    else return null;
}

function renderOverlay<Props extends IVisualPickerProps>(h: CreateElement, props: Props): VNode | null {
    if (props.caption) {
        return (
            <span class={['visual-picker-peek', { disabled: props.disabled }]}>
                {props.caption}
            </span>
        );
    }
    else return null;
}

function renderContents<Props extends IVisualPickerProps>(h: CreateElement, props: Props, slots: any): VNode | null
{
    let slot = slots().default;
    if (slot) return slot;
    else 
    {
        let contentClasses: (string | object)[] = ['tile', { 'tile-lg': !props.size, 'tile-xl': props.size === "lg", 'tile-sm': props.size === "sm" }];
        if (props.variant) {
            let bgClass: any = {};
            bgClass['bg-' + props.variant] = true;
            contentClasses.push(bgClass);
        }
        return (
            <span class={ contentClasses }>
                { slots().tile }
            </span>
        );
    }
}


function renderVisualPicker<Props extends IVisualPickerProps>(
    h: CreateElement,
    context: RenderContext<Props>,
    outerTag: () => string,
    innerTag: () => string,
    outerData: RenderingDataFunction<Props>,
    innerData: RenderingDataFunction<Props>,
    renderControl: RenderingControlFunction<Props>,
    renderContents: RenderingContentsFunction<Props>,
    renderPeek: RenderingFunction<Props>
) 
{
    return (
        renderOuterTag(h, context.props, context.listeners, outerTag, outerData(context.props, context.data.class),
        [
            renderControl(h, context.props, context.listeners),
            renderInnerTag(h, context.props, innerTag, innerData(context.props, undefined),
            [
                renderContents(h, context.props, context.slots)
            ]
            ),
            renderPeek(h, context.props)
        ]
        )
    );
}


/* Functional component definitions */
let VisualPicker = Vue.extend<IVisualPickerProps>({
    functional: true, 
    name: 'VisualPicker',
    props: VisualPickerPropsDef,
    render(h: CreateElement, context: RenderContext<IVisualPickerProps>) {
        return renderVisualPicker(
            h, 
            context,
            defaultOuterTag,
            defaultInnerTag,
            defaultOuterTagData,
            defaultInnerTagData,
            (h, props) => null,
            renderContents,
            renderPeek
        );
    }
});
let VisualLink = Vue.extend<IVisualLinkProps>({
    functional: true, 
    name: 'VisualLink',
    props: VisualLinkPropsDef,
    render(h: CreateElement, context: RenderContext<IVisualLinkProps>) {
        return renderVisualPicker(
            h, 
            context,
            () => "router-link",
            defaultInnerTag,
            linkOuterTagData,
            defaultInnerTagData,
            (h, props) => null,
            renderContents,
            renderPeek
        );
    }
});
let VisualCheck = Vue.extend<IVisualPickerWithControlProps>({
    functional: true, 
    name: 'VisualCheck',
    props: VisualPickerWithControlPropsDef,
    model: {
        prop: 'checked',
        event: 'change'
      },
    render(h: CreateElement, context: RenderContext<IVisualPickerWithControlProps> ) {
        return renderVisualPicker(
            h, 
            context,
            defaultOuterTag,
            withControlInnerTag,
            defaultOuterTagData,
            withControlInnerTagData,
            CommonProps.renderCheckbox,
            renderContents,
            renderPeek
        );
    }
});
let VisualRadio = Vue.extend<IVisualPickerWithControlProps>({
    functional: true, 
    name: 'VisualRadio',
    props: VisualPickerWithControlPropsDef,
    model: {
        prop: 'checked',
        event: 'change'
      },
    render(h: CreateElement, context: RenderContext<IVisualPickerWithControlProps>) {
        return renderVisualPicker(
            h, 
            context,
            defaultOuterTag,
            withControlInnerTag,
            defaultOuterTagData,
            withControlInnerTagData,
            CommonProps.renderRadio,
            renderContents,
            renderPeek
        );
    }
});


export {VisualPicker, VisualCheck, VisualRadio, VisualLink};
