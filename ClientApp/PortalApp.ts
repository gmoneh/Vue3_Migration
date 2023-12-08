import Vue, { ComponentOptions } from 'vue';
import * as App from "./App";
import {getUIAssetUrl} from "@ClientApp/utils/uiassets";


export interface PortalData {
    isEnterprise: boolean,
    isLSIEnterprise: boolean,
    isSpark: boolean,
    isIPSUK: boolean,
    instanceId: string,
    loginDisabled: string,
    useCaptcha: boolean
}


export function startApp(options?: App.StartAppOptions)
{
    if (!options) options = {};
    options.component = {
        provide() {
            return {
                assetUrl: function(assetName: string, variant?: string)
                {
                    return getUIAssetUrl(assetName, variant);
                },
                isEnterprise: function()
                {
                    return PortalData.isEnterprise;
                },
                loginDisabled: function() {
                    return PortalData.loginDisabled;
                },
                portalName,
                logoUrl,
                privacyPolicyUrl,
                termsOfUseUrl
            }
        }
    }
    App.startApp(options);
}


export let PortalData: PortalData = window.INITIAL_DATA?.PortalData == undefined? null : JSON.parse(window.INITIAL_DATA.PortalData);


function privacyPolicyUrl() {
    return PortalData.isEnterprise?
        "https://www.ingramcontent.com/page/privacy-policy" :
        "https://www.ingramspark.com/privacy-policy";
}

function termsOfUseUrl() {
    return PortalData.isEnterprise?
        "https://www.ingramcontent.com/publishers-page/lighting-source-terms-of-use" :
        "https://www.ingramspark.com/terms-of-use";

}


function portalName() {
    if (PortalData.isLSIEnterprise) {
        return "Lightning Source";
    }
    if (PortalData.isSpark) {
        return "IngramSpark";
    }
    return "Ingram Content Group";
}

function logoUrl() {
    if (PortalData.isLSIEnterprise) {
        return "/images/lightning-source.png";
    }
    if (PortalData.isSpark) {
        return "https://www.ingramspark.com/hubfs/templates/new-alt/images/ingramspark-logo.png";
    }
    return "/images/icg_logo.svg";
}
