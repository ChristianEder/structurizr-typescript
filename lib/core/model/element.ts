import { ModelItem } from "./modelItem";
import { IEquatable } from "./iequatable";
import { Model } from "./model";
import { Relationships } from "./relationships";


export abstract class Element extends ModelItem implements IEquatable<Element> {

    public static CanonicalNameSeparator = "/";

    public name!: string;
    public description!: string;
    public url!: string;
    public model!: Model;
    public relationships = new Relationships(this);

    public toDto(): any {
        var dto = super.toDto();
        dto.name = this.name;
        dto.description = this.description;
        dto.url = this.url;
        dto.relationships = this.relationships.toDto();
        return dto;
    }

    public fromDto(dto: any) {
        super.fromDto(dto);
        this.name = dto.name;
        this.description = dto.description;
        this.url = dto.url;
        this.relationships.fromDto(dto.relationships);
    }

    public abstract get canonicalName(): string;

    public abstract get parent(): Element | null;
    public abstract set parent(p: Element | null);

    public abstract get type(): string;

    public equals(other: Element): boolean {
        if (!other) {
            return false;
        }

        if (other === this) {
            return true;
        }

        if (other.type !== this.type) {
            return false;
        }

        return this.canonicalName === other.canonicalName;
    }

    protected formatForCanonicalName(name: string): string {
        return name.replace(Element.CanonicalNameSeparator, "");
    }
}