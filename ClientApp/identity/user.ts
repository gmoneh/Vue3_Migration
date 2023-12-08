
export type CustomerRating = 'AccountDisabled' | 'Deleted' | 'Inactive' | 'ApplicationPending' | 'AwaitingMaterials' | 'LSIProcessing' | 'PublisherAccess'
                            | 'Unverified' | 'ApplicationOnHold';

export const RoleGroups = {
    LSIPUB: "LSIPUB",
    LSICSR: "LSICSR",
    TITLE_VIEW: "TITLE_VIEW",
    TITLE_EDIT: "TITLE_EDIT",
    ORDER_VIEW: "ORDER_VIEW",
    ORDER_EDIT: "ORDER_EDIT",
    TITLE_PROOF: "TITLE_PROOF",
    FINRPT_AR_INV: "FINRPT-AR-INV",
    LSIPROOF: "LSIPROOF",
    JOURNALS: "JOURNALS",
    IPPPUB: "IPPPUB",
    FINRPT_AR_HIST: "FINRPT-AR-HIST",
    FINRPT_AR_STMT: "FINRPT-AR-STMT",
    PUBPROOF: "PUBPROOF",
    FINRPT_PUBCOMP: "FINRPT-PUBCOMP",
    SUPPORT: "SUPPORT",
    LSINEW: "LSINEW",
    LSIRET: "LSIRET",
    ASSOCIATES: "ASSOCIATES",
    SIBILINKS: "SIBILINKS",
    SIBICONFIG: "SIBICONFIG",
    ANONUPLD: "ANONUPLD",
    PROG_PRICING: "PROG_PRICING",
    PROG_PRICING_ELIGIBLE: "PROG_PRICING_ELIGIBLE",
    CCMAINT: "CCMAINT",
    PUBPARTNER: "PUBPARTNER",
    PROG_PRICING_RESTRICTED: "PROG_PRICING_RESTRICTED",
    IGNITE_ELIGIBLE: "IGNITE_ELIGIBLE",
    REPORTS_SALES: "REPORTS_SALES",
    REPORTS_TITLES: "REPORTS_TITLES",
    REPORTS_PUBCOMP: "REPORTS_PUBCOMP",
    REPORTS_TRANS: "REPORTS_TRANS",
    REPORTS_BILLING: "REPORTS_BILLING",
    ECOMMERCE: "ECOMMERCE"
}


export interface IUser {
    user: string;
    accountName: string;
    customerNumber: string;
    isSpark: boolean;
    isEnterprise: boolean;
    isLSIEnterprise: boolean;
    rating: number;
    roles?: [keyof typeof RoleGroups];
    isIgniteUser: boolean;
    isDistributionUser: boolean;   
    hasSparkProContract: boolean;
    userId?: string;
    verified?: boolean;
    isMigratedAccount?: boolean;
}

export function hasRole(roleGroup: keyof typeof RoleGroups): boolean {
    return User.roles? User.roles.indexOf(roleGroup) >= 0 : false;
}

export function isSessionVerified() {
    return User.verified == true;
}

export function isSupportSession(): boolean {
    return hasRole("SUPPORT");
}

export function haseCommerce(): boolean {
    return hasRole("ECOMMERCE");
}

export function hasSalesReportsRole(): boolean {
    return hasRole("REPORTS_SALES");
}

export function hasTitlesReportsRole(): boolean {
    return hasRole("REPORTS_TITLES");
}

export function hasPubCompReportsRole(): boolean {
    return hasRole("REPORTS_PUBCOMP");
}

export function hasTransactionsReportsRole(): boolean {
    return hasRole("REPORTS_TRANS");
}

export function hasBillingReportsRole(): boolean {
    return hasRole("REPORTS_BILLING");
}

export let User: IUser = window.INITIAL_DATA?.User == undefined? null : JSON.parse(window.INITIAL_DATA.User);
