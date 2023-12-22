import Vue, { createApp, Plugin } from 'vue';
import { configureCompat } from "vue";
import type { ComponentOptions, App } from 'vue';
import { compose, identity } from "ramda";
import { BootstrapVue, BootstrapVueIcons, BIcon } from 'bootstrap-vue'
import VueRouter, {createRouter, createWebHistory, RouterOptions, _RouteRecordBase as RouteBase, RouteRecordRaw as Route, RouteLocation } from "vue-router";
import { createPinia } from 'pinia';
import HelpIcon from "./directives/HelpIcon";
import RequiredIcon from "./directives/RequiredIcon";
import {VisualCheck, VisualLink, VisualPicker, VisualRadio} from "@ClientApp/components/VisualPicker";
import * as Filters from "./filters/filters";
import * as Formatters from "./utils/formatters";

// Deprecated in Vue 3
// @ts-ignore Here only to have WebStorm register these directives
Vue.directive('lsi-help-icon', HelpIcon);
// @ts-ignore
Vue.directive('lsi-required-icon', RequiredIcon);
// @ts-ignore
Vue.component('b-icon', BIcon);
// @ts-ignore
Vue.component('lsi-visual-picker', VisualPicker);
// @ts-ignore
Vue.component('lsi-visual-check', VisualCheck);
// @ts-ignore
Vue.component('lsi-visual-radio', VisualRadio);
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

configureCompat({
    COMPONENT_ASYNC: false
});

type AppCreationFunction<T> = (opt?: ComponentOptions<Vue>) => App<T>;
type AppInitializationFunction<T> = (theApp: App<T>) => App<T>;

export interface StartAppOptions {
    router?: Partial<RouterOptions>;
    component?: ComponentOptions<Vue>;
    createFunction?: AppCreationFunction<Element>;
    initFunction?: AppInitializationFunction<Element>;
}


function instantiateApp(componentOptions?: ComponentOptions<Vue>) {
    return createApp({
        el: "div.app",
        ...componentOptions,
    });
}

export function initializeApp(appRoot: App<Element>) {
    // Alternate way of initializing for Vue 3
    appRoot.use(BootstrapVue as unknown as Plugin);
    appRoot.use(BootstrapVueIcons as unknown as Plugin);
    appRoot.directive('lsi-help-icon', HelpIcon);
    appRoot.directive('lsi-required-icon', RequiredIcon);
    appRoot.component('b-icon', BIcon);
    appRoot.component('lsi-visual-picker', VisualPicker);
    appRoot.component('lsi-visual-check', VisualCheck);
    appRoot.component('lsi-visual-radio', VisualRadio);
    appRoot.component('lsi-visual-link', VisualLink);
    return appRoot;
}


export function initializeStore(appRoot: App<Element>) {
    appRoot.use(createPinia());
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
    let _createApp = options?.createFunction || instantiateApp;
    let _initApp = compose(options?.initFunction ?? identity,  initializeApp);
    let theApp = _createApp(initializeOptions);
    theApp = (_initApp)? _initApp(theApp) : theApp;
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
