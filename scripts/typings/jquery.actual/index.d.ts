// Type definitions for LSI Javascript framework
/// <reference types="jquery"/>

declare module jquery.actual {

        interface ConfigOptions
        {
            absolute?: boolean;
            clone?: boolean,
            includeMargin?: boolean;
            display?: string;
            prop?: boolean;
        }

}


interface JQuery<TElement = HTMLElement> {
    actual(method: string, options?: jquery.actual.ConfigOptions): any;
}
