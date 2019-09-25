import { Element } from "../model/element";
import { Format } from "./format";
import { DecisionStatus } from "./decisionStatus";

export interface DecisionDto {
    id: string;
    date: string;
    status: DecisionStatus;
    title: string;
    content: string;
    format: Format;
    elementId?: string;
}

export class Decision {
    id: string;
    date: Date;
    status: DecisionStatus;
    element: Element | null;
    title: string;
    format: Format;
    content: string;

    constructor(
        element: Element | null,
        id: string,
        date: Date,
        title: string,
        status: DecisionStatus,
        format: Format,
        content: string
    ) {
        this.element = element;
        this.id = id;
        this.date = date;
        this.title = title;
        this.status = status;
        this.format = format;
        this.content = content;
    }

    private _elementId?: string;

    get elementId() {
        return this.element ? this.element.id : this._elementId;
    }

    set elementId(value) {
        this._elementId = value;
    }

    toDto(): DecisionDto {
        return {
            id: this.id,
            date: this.date.toISOString(),
            status: this.status,
            title: this.title,
            content: this.content,
            format: this.format,
            elementId: this.elementId
        };
    }
}
