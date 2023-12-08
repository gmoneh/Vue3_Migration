import Vue, { createApp, Plugin } from 'vue';
import type { ComponentOptions, App } from 'vue';
import VueRx from 'vue-rx';
import { BootstrapVue, BootstrapVueIcons, BIcon } from 'bootstrap-vue'
import VueRouter, {createRouter, createWebHistory, RouterOptions, _RouteRecordBase as RouteBase, RouteRecordRaw as Route, RouteLocation } from "vue-router";
import HelpIcon from "./directives/HelpIcon";
import RequiredIcon from "./directives/RequiredIcon";
import * as Filters from "./filters/filters";
import * as Formatters from "./utils/formatters";

// Deprecated in Vue 3
Vue.filter('dashify', Filters.dashify);
Vue.filter('shortDate', Filters.shortDate);
Vue.filter('longDate', Filters.longDate);
Vue.filter('monthAbbrevDate', Filters.monthAbbrevDate);
Vue.filter('monthAbbrevDateTime', Filters.monthAbbrevDateTime)
Vue.filter('yesno', Filters.yesno);
Vue.filter('twoDecimals', Filters.twoDecimals);
Vue.filter('usLocalized', Filters.USLocalizedNumber);
Vue.filter('currency', Formatters.formatCurrencyAmount);
Vue.filter('percentage', Formatters.formatPercentage);



type AppInitializationFunction<T> = (opt?: ComponentOptions<Vue>) => App<T>;

export interface StartAppOptions {
    router?: Partial<RouterOptions>;
    component?: ComponentOptions<Vue>;
    initFunction?: AppInitializationFunction<Element>;
}


export function initializeApp(componentOptions?: ComponentOptions<Vue>) {
    let appRoot = createApp({
        el: "div.app",
        ...componentOptions,
    });
    // Alternate way of initializing for Vue 3
    appRoot.use((theApp) => {
        VueRx(Vue);
    });
    appRoot.use(BootstrapVue as unknown as Plugin);
    appRoot.use(BootstrapVueIcons as unknown as Plugin);
    appRoot.directive('lsi-help-icon', HelpIcon);
    appRoot.directive('lsi-required-icon', RequiredIcon);
    appRoot.component('b-icon', BIcon);
    return appRoot;
}


function initializeRouterOptions(options: Partial<RouterOptions>) {
    let catchAllPath: Route = {
        name: "catchAll",
        path: '/:pathMatch(.*)',
        redirect: undefined,
        beforeEnter(to: RouteLocation) {
            // We'll fallback on the server for any unknown path
            window.location.href = to.fullPath;
        }
    } as unknown as Route;
    options.routes = options.routes? [...options.routes, catchAllPath] : [catchAllPath];
    options.scrollBehavior = (to, from, savedPosition) => {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0, left: 0 }
        }
    }
    if (!options.history) {
        options.history = createWebHistory();
    }
    return options as RouterOptions; //Now that we added history, the type is complete
}

export function initializeRouter(theApp: App<Element>, options: Partial<RouterOptions>)
{
    const router = createRouter(
        initializeRouterOptions(options)
    );
    theApp.use(router);
}


export function startApp(options?: StartAppOptions)
{
    let initializeOptions: ComponentOptions<Vue> | undefined = options?.component;
    let initApp = options?.initFunction || initializeApp;
    let theApp = (initApp)? initApp(initializeOptions) : null;
    if (theApp) {
        if (options && options.router)
        {
            initializeRouter(theApp, options.router)
        }
        theApp.mount("div.app");
    }
    return theApp;
}



declare global {
    interface Window {
        INITIAL_DATA: any;
    }
}
