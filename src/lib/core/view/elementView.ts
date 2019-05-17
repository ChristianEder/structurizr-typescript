import { IEquatable } from "../model/iequatable";
import { Element } from "../model/element";

export class ElementView implements IEquatable<ElementView>{
    public element!: Element;
    public id!: string;
    public x?: number;
    public y?: number;

    protected get type(): string {
        return "ElementView";
    }

    constructor(element?: Element) {
        if (element) {
            this.element = element;
            this.id = element.id;
        }
    }

    public equals(other: ElementView): boolean {
        if (!other) {
            return false;
        }

        if (other === this) {
            return true;
        }

        if (other.type !== this.type) {
            return false;
        }

        return this.id === other.id;
    }

    public copyLayoutInformationFrom(source: ElementView) {
        if (source) {
            this.x = source.x;
            this.y = source.y;
        }
    }

    public toDto(): any {
        return {
            id: this.id,
            x: this.x,
            y: this.y
        }
    }


    public fromDto(dto: any): void {
        this.id = dto.id;
        this.x = dto.x;
        this.y = dto.y;
    }
}