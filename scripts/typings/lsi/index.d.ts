/// <reference types="jquery"/>
declare namespace LSI {

    export function resolveQualifiedObject(objectQName: string): string;


    export namespace IPP {
        function updateBookTypeSelectorErrors(): void;

        interface bookTypeSelectorOptions {
            TrimSizeRequired?: boolean;
            TrimSizeHelp?: boolean;
            ValidateBookType?: boolean;
        }

        interface BookTypeSelector {
            setBookTypeId(bookTypeId: string, options: bookTypeSelectorOptions, callback?: (bookTypeId: string, options: bookTypeSelectorOptions) => any): void;
        }

        var BookTypeSelector: {
            new (element: JQuery<HTMLElement>): BookTypeSelector;
            current: BookTypeSelector;
        }

        module AddressSearchCriteria {
            function searchSuccess(data: string, textStatus: string, jqXHR: JQueryXHR): void;
        }

        module PaymentMethodPrompt {
            function WireCardOrderAreas(): void;
        }


    }

    export namespace CSS.ShipmentChoices.Options {
        function wireRadioButtons(): void;
    }


    export namespace CC {
        namespace UI {
            function OnSubmitPaymentClicked(form: JQuery, any: any): void;
            function wirePanel(): void;
        }
    }

}


interface JQuery<TElement = HTMLElement> {
    applyFormAspects(options?: LSI.UI.Forms.FormOptions): void;
    ipp_grid(options?: any): void;
    disable(): this;
    enable(): this;
    buttontext(state: string): this;
    buttontextreset(): this;
    lsihide(): this;
    lsishow(): this;

    attr(name: 'data-action-url'): string;
    attr(name: 'data-index'): number;
}

type addOrRemoveClass = (className: string) => JQuery<HTMLElement>;

declare class FroalaEditor {
    constructor(element: any, options: any);
}


declare function applyGridAspects(context?: JQuery) : void;
declare function applyFormAspects(jqset?: JQuery) : void;

