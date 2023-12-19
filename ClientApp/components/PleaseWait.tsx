import {FunctionalComponent, h, SetupContext} from 'vue';


type PleaseWaitProps = {
    text: string,
    variant: string,
    small: boolean
}


const PleaseWait: FunctionalComponent<PleaseWaitProps, {}> = (props, context) => {
        return (
            <div class={ ["text-center", "text-" + props.variant, "my-2"] } style={ {'line-height':'1rem'} } { ...context.attrs }>
                <b-spinner variant={ props.variant } small={ props.small } class="align-middle"></b-spinner>
                <strong style={ {'margin-left': '0.5rem', 'vertical-align': 'top'} }>{ props.text }</strong>
            </div>
        )
    }

PleaseWait.props = {
    text: { type: String, default: 'Loading...' },
    variant: String,
    small: { type: Boolean, default: false }
}


export default PleaseWait;

