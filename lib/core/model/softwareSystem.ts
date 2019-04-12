import { StaticStructureElement } from "./staticStructureElement";
import { IEquatable } from "./iequatable";
import { Element } from "./element";
import { Location } from "./location";
import { Tags } from "./tags";

export class SoftwareSystem extends StaticStructureElement implements IEquatable<SoftwareSystem>{

    public static type = "SoftwareSystem";
    public get type(): string { return SoftwareSystem.type; }

    public get parent(): Element | null { return null; }
    public set parent(p: Element | null) { }

    public location = Location.Unspecified;

    public get canonicalName(): string {
        return Element.CanonicalNameSeparator + super.formatForCanonicalName(this.name);
    }

    public toDto() {
        var dto = super.toDto();
        dto.location = this.location;
        return dto;
    }

    public fromDto(dto: any) {
        super.fromDto(dto);
        this.location = dto.location;
    }

    public getRequiredTags() {
        return [Tags.Element, Tags.SoftwareSystem];
    }

}