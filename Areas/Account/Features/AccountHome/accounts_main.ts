import Vue from 'vue';
import type { RouterOptions } from 'vue-router';
import * as App from "@ClientApp/CoreApp";
import AccountsHomeRoutes from "./accounts_routes";
import AccountInfoView from "@Account/AccountHome/AccountInfoView.vue";
import PubCompView from "@Account/AccountHome/PubCompView.vue";

const routerConfig: Partial<RouterOptions> = {
    routes: [
        {
            ...AccountsHomeRoutes.AccountInformation,
            component: AccountInfoView
        },
        {
            ...AccountsHomeRoutes.PubComp,
            component: PubCompView
        }
    ]
}


App.startApp({ router: routerConfig });
