// Type definitions for jquery.spin.js 1.3.1
// requires spin.js

import { SpinnerOptions } from 'spin.js';


declare global {
    interface JQuery<TElement = HTMLElement> {
        spin(options?: boolean): this;
        spin(options?: SpinnerOptions, color?: string): this;
    }
}