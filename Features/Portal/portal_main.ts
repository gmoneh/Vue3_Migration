import Vue from 'vue';
import type { RouterOptions } from 'vue-router';
import { initializeStore } from "@ClientApp/App";
import * as App from "@ClientApp/PortalApp";
import PortalRoutes from './portal_routes';
import PortalView from './PortalView.vue';
import DashboardView from './DashboardView.vue';


const routerConfig: Partial<RouterOptions> = {
    routes: [
        {
            ...PortalRoutes.Portal,
            component: PortalView
        },
        {
            ...PortalRoutes.Dashboard,
            component: DashboardView
        }
    ]
}

App.startApp({
    initFunction: initializeStore,
    router: routerConfig
});

