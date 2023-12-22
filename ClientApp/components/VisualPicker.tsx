import Vue, {FunctionalComponent, h, SetupContext, VNode, VNodeArrayChildren, Slot, Slots, Component} from 'vue';
import { RouteLocation, RouterLink } from "vue-router";
import { dissoc } from 'ramda';
import * as CommonProps from "./FormControlProps";
import {FunctionalComponentContext, VNodeData} from "./FormControlProps";

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

type RenderingDataFunction<Props extends IVisualPickerProps> = (props: Props, classes: any) => VNodeData;
type RenderingFunction<Props extends IVisualPickerProps> = (props: Props) => VNode | null;
type RenderingContentsFunction<Props extends IVisualPickerProps> = (props: Props, slots: Slots) => VNode | VNodeArrayChildren | null;
type RenderingControlFunction<Props extends IVisualPickerProps> = (props: Props, context: FunctionalComponentContext) => VNode | null;
type RenderOverlayFunction<Props extends IVisualPickerProps> = (props: Props) => VNode | null;

function defaultOuterTag() {return "div"}
function defaultInnerTag() { return "div" }

function withControlInnerTag() { return "label" }


function defaultOuterTagData<Props extends IVisualPickerProps>(props: Props, classes: any): VNodeData {
    return { class: defaultOuterClass(props, classes) };
}

function linkOuterTagData<Props extends IVisualLinkProps>(props: Props, classes: any): VNodeData {
    let data = defaultOuterTagData(props, classes);
    data = {...data, to: props.href };
    return data;
}

function defaultInnerTagData<Props extends IVisualPickerProps>(props: Props): VNodeData {
    return { class: { 'visual-picker-figure': true, disabled: props.disabled }};
}

function withControlInnerTagData<Props extends IVisualPickerWithControlProps>(props: Props): VNodeData {
    let data = defaultInnerTagData(props);
    data = {...data, 'for': CommonProps.controlId(props)}
    return data;
}

function defaultOuterClass<Props extends IVisualPickerProps>(props: Props, extraClasses: any): any {
    let outerClass: any = { 
        'visual-picker': true, 
        'has-peek-inside': !!(props.caption && !props['caption-outside']),
        'has-peek': !!(props.caption && props['caption-outside'])
    };
    if (props.size) {
        outerClass['visual-picker-' + props.size] = true;
    }
    if (props.short) {
        outerClass['visual-picker-short'] = true;
    }
    outerClass['visual-picker-' + (props.variant || "")] = !!props.variant;
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


function renderOuterTag<Props extends IVisualPickerProps>(props: Props, context: FunctionalComponentContext, outerTag: CommonProps.ComponentDefFunc, data: VNodeData, contents: VNodeArrayChildren)
{
    return h(outerTag(), dissoc('onChange', data), contents);
}

function renderInnerTag<Props extends IVisualPickerProps>(props: Props, innerTag: CommonProps.ComponentDefFunc,  data: VNodeData, contents: VNodeArrayChildren)
{
    return h(innerTag(), data, 
        [
        <span class="visual-picker-content">
            { contents }
        </span>
        ]
    );
}

function renderPeek<Props extends IVisualPickerProps>(props: Props): VNode | null
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

function renderOverlay<Props extends IVisualPickerProps>(props: Props): VNode | null {
    if (props.caption) {
        return (
            <span class={['visual-picker-peek', { disabled: props.disabled }]}>
                {props.caption}
            </span>
        );
    }
    else return null;
}

function renderContents<Props extends IVisualPickerProps>(props: Props, slots: Slots): VNode | VNodeArrayChildren | null
{
    let slot = slots.default;
    if (slot) return slot();
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
                { slots.tile }
            </span>
        );
    }
}


function renderVisualPicker<Props extends IVisualPickerProps>(
    props: Props,
    context: FunctionalComponentContext,
    outerTag: CommonProps.ComponentDefFunc,
    innerTag: CommonProps.ComponentDefFunc,
    outerData: RenderingDataFunction<Props>,
    innerData: RenderingDataFunction<Props>,
    renderControl: RenderingControlFunction<Props>,
    renderContents: RenderingContentsFunction<Props>,
    renderPeek: RenderingFunction<Props>
) 
{
    return (
        renderOuterTag(props, context, outerTag, outerData(props, context.attrs.class),
        [
            renderControl(props, context),
            renderInnerTag(props, innerTag, innerData(props, undefined),
            [
                renderContents(props, context.slots)
            ]
            ),
            renderPeek(props)
        ]
        )
    );
}


/* Functional component definitions */
let VisualPicker: FunctionalComponent<IVisualPickerProps, {}> = (props, context) => {
        return renderVisualPicker(
            props,
            context,
            defaultOuterTag,
            defaultInnerTag,
            defaultOuterTagData,
            defaultInnerTagData,
            (props, context) => null,
            renderContents,
            renderPeek
        );
    };


let VisualLink: FunctionalComponent<IVisualLinkProps, {}> = (props, context) => {
        return renderVisualPicker(
            props,
            context,
            () => RouterLink,
            defaultInnerTag,
            linkOuterTagData,
            defaultInnerTagData,
            (props, context) => null,
            renderContents,
            renderPeek
        );
    };

let VisualCheck: FunctionalComponent<IVisualPickerWithControlProps, {}> = (props, context) => {
        return renderVisualPicker(
            props,
            context,
            defaultOuterTag,
            withControlInnerTag,
            defaultOuterTagData,
            withControlInnerTagData,
            CommonProps.renderCheckbox,
            renderContents,
            renderPeek
        );
    };

let VisualRadio: FunctionalComponent<IVisualPickerWithControlProps, {}> = (props, context) => {
        return renderVisualPicker(
            props,
            context,
            defaultOuterTag,
            withControlInnerTag,
            defaultOuterTagData,
            withControlInnerTagData,
            CommonProps.renderRadio,
            renderContents,
            renderPeek
        );
    };



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

VisualPicker.props = VisualPickerPropsDef;
VisualLink.props = VisualLinkPropsDef;
VisualCheck.props = VisualPickerWithControlPropsDef;
VisualRadio.props = VisualPickerWithControlPropsDef;


export {VisualPicker, VisualCheck, VisualRadio, VisualLink};
