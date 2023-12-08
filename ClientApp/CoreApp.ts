import Vue, { ComponentOptions, App as VueApp } from 'vue';
import * as App from "./App";
import {isSupportSession, User} from "./identity/user";

function initializeCoreLayout(componentOptions?: ComponentOptions<Vue>)
{
    /*
    Vue.component('app-aside', AppAside);
    Vue.component('app-header', AppHeader);
    Vue.component('app-main', AppMain);
    Vue.component('app-header-simple', AppHeaderSimple);
*/
    return App.initializeApp(componentOptions);
}


export function startApp(options?: App.StartAppOptions)
{
    if (!options) options = {};
    options.initFunction = options.initFunction || initializeCoreLayout;
    options.component = {
        provide() {
            return {
                User,
                isEnterprise: function()
                {
                    return User.isEnterprise;
                },
                portalName: function() {
                    return User.isEnterprise? "Lightning Source" : "IngramSpark"
                },
                isSupportSession: function() {
                    return isSupportSession();
                }
            }
        }
    }
    App.startApp(options);
}
