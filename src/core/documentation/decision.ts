import { Element } from "../model/element";
import { Format } from "./format";
import { DecisionStatus } from "./decisionStatus";

export class Decision {
    public id?: string;
    public date?: Date;
    public status?: DecisionStatus;
    public element?: Element;
    public title?: string;
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
            id: this.id,
            date: this.date!.toISOString(),
            status: this.status,
            title: this.title,
            content: this.content,
            format: this.format,
            elementId: this.elementId
        };
    }

    public fromDto(dto: any) {
        this.id = dto.id;
        this.date = new Date(dto.date);
        this.status = dto.status;
        this.title = dto.title;
        this.content = dto.content;
        this.format = dto.format;
        this.elementId = dto.elementId;
    }
}
