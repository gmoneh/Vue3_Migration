import { Directive }  from 'vue';

let RequiredIcon: Directive = {
    beforeMount: function(el, binding) {
        let showIcon = binding.value == undefined || (typeof binding.value == "boolean" && binding.value == true)
        let onTheRight = typeof binding.modifiers.right == "boolean" && binding.modifiers.right == true;
        const iconTemplate = `<i class="fas fa-asterisk required-icon ${onTheRight? 'right' : ''}"></i>`;
        if (showIcon) el.insertAdjacentHTML(onTheRight? 'beforeend' : 'afterbegin', iconTemplate);
    }
}

export default RequiredIcon;
