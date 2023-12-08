import Vue, {VueConstructor, RenderContext} from 'vue';


const HelpPopoverTitle = ({listeners}: RenderContext) =>
    <div>
        Help
        <button type="button" class="close" data-dismiss="popover" on={ listeners } >&times;</button>
    </div>


export default HelpPopoverTitle as unknown as VueConstructor;