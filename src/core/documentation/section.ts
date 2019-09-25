import { Element } from "../model/element";
import { Format } from "./format";

export interface SectionDto {
    title: string;
    content: string;
    format: Format;
    order: number;
    elementId: string | null;
}

export class Section {
    element: Element | null;
    title: string;
    order: number;
    format: Format;
    content: string;

    private _elementId?: string;

    constructor(
        element: Element | null,
        title: string,
        order: number,
        format: any,
        content: string
    ) {
        this.element = element;
        this.title = title;
        this.order = order;
        this.format = format;
        this.content = content;
    }

    get elementId() {
        return this.element ? this.element.id : this._elementId;
    }

    set elementId(value) {
        this._elementId = value;
    }

    toDto(): SectionDto {
        return {
            title: this.title,
            content: this.content,
            format: this.format,
            order: this.order,
            elementId: this.element ? this.element.id : null
        };
    }
}
