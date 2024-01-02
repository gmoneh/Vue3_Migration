import Vue, { Directive }  from 'vue';
import { BPopover } from 'bootstrap-vue';
import { ajax } from 'rxjs/ajax';
import HelpPopupTitle from "./HelpPopupTitle";

const ATTR_HELP_TOPIC_ID = 'help-topic-id';


export function onHelpIconClick(event: Event)
{
    let icon = (event.target as Element);
    let helpTopicId = icon.getAttribute(ATTR_HELP_TOPIC_ID);
    if (!helpTopicId) return;
    const h$ = ajax({
        url: `/help/Topic/${helpTopicId}`,
        responseType: 'document'
    });
    h$.subscribe((response) => {
        let popover = new BPopover({
            propsData: {
                target: icon,
                placement: 'top',
                html: true,
                trigger: 'click',
                show: true
            }
        });
        let renderContent = Vue.compile('<div>' + response.response + '</div>');
        const clickHandler = (e: MouseEvent) => {
            popover.$emit('close');
        }
        (popover as any).$scopedSlots = {
            ...popover.$scopedSlots,
            default:  () => [ renderContent.apply(popover) ],
            title: () => [popover.$createElement(HelpPopupTitle, { on: { 'click':  clickHandler}})]
        };
        popover.$mount();
        icon.parentElement!.appendChild(popover.$el);
    },
    (error) => {
        console.log(`Topic ID ${helpTopicId} does not exist`);
    }
    );
}


let HelpIcon: Directive = {
    beforeMount: function(el, binding) {
        if (binding.value) {
            let iconid = `help-icon-${binding.value}`;
            const iconTemplate = `<i class="far fa-question-circle help-icon" id="${iconid}" ${ATTR_HELP_TOPIC_ID}="${binding.value}"></i>`
            el.insertAdjacentHTML('beforeend', iconTemplate);
            let icon = el.querySelector('#' + iconid);
            if (icon) icon.addEventListener('click', onHelpIconClick, {once: true});
        }
    },

    unmounted: function(el, binding) {
        if (binding.value) {
            let iconid = `help-icon-${binding.value}`;
            let icon = el.querySelector('#' + iconid);
            if (icon) icon.removeEventListener('click', onHelpIconClick);
        }
    }
}

export default HelpIcon;
