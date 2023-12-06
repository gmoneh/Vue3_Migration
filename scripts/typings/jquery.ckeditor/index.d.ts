/// <reference types="jquery"/>
/// <reference types="ckeditor"/>
interface JQuery<TElement = HTMLElement> {
    ckeditor(configuration?: CKEDITOR.config, callback?: (element?: Element) => void): JQuery;
}

declare namespace CKEDITOR {
    interface config {
        wordcount: {
            showParagraphs?: boolean,
            showWordCount?: boolean,
            showCharCount?: boolean,
            showByteCount?: boolean,
            countSpacesAsChars?: boolean,
            countBytesAsChars?: boolean,
            countHTML?: boolean,
            maxWordCount?: number,
            maxCharCount?: number,
            maxByteCount?: number
        }
    }

    class htmlDataProcessorAndWriter extends htmlDataProcessor {
        writer: htmlWriter;
    }

    class htmlEditor extends editor {
        dataProcessor: htmlDataProcessorAndWriter;
    }
}
