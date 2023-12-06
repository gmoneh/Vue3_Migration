declare namespace LSI.UI {
    export namespace Forms {
        interface FormOptions {
            force?: boolean,
            inputAspects?: boolean,
            dateAspects?: boolean,
            requiredAspects?: boolean,
            helpAspects?: boolean,
            buttonAspects?: boolean,
            dependentControl?: boolean,
            validationAspects?: boolean,
            multiTextboxAspects?: boolean,
            charCounterAspects?: boolean
        }

        function destroyPopovers(): void;
    }

    export namespace Clipboard {
        function wireUp(selector?: string): string;
    }
}

