import { Element } from "../model/element";
import { Format } from "./format";

export class Section {
    public element?: Element;
    public title?: string;
    public order?: number;
    public format?: Format;
    public content?: string;

    private _elementId?: string;
    get elementId() {
        return this.element ? this.element.id : this._elementId;
    }
    set elementId(value) {
        this._elementId = value;
    }

    public toDto() {
        return {
            title: this.title,
            content: this.content,
            format: this.format,
            order: this.order,
            elementId: this.element ? this.element.id : null
        };
    }

    public fromDto(dto: any) {
        this.title = dto.title;
        this.content = dto.content;
        this.format = dto.format;
        this.order = dto.order;
        this.elementId = dto.elementId;
    }
}
