import { StaticStructureElement } from "./staticStructureElement";
import { IEquatable } from "./iequatable";
import { SoftwareSystem } from "./softwareSystem";
import { Element } from "./element";
import { Tags } from "./tags";

export class Container extends StaticStructureElement implements IEquatable<Container>{

    public static type = "Container";
    public get type(): string { return Container.type; }

    public parent!: Element | null;

    public technology?: string;

    public get softwareSystem(): SoftwareSystem | null {
        return this.parent as SoftwareSystem;
    }

    public get canonicalName(): string {
        return this.parent!.canonicalName + Element.CanonicalNameSeparator + super.formatForCanonicalName(this.name);
    }

    public toDto() {
        var dto = super.toDto();
        dto.technology = this.technology;
        dto.components = [];
        return dto;
    }

    public fromDto(dto: any) {
        super.fromDto(dto);
        this.technology = dto.technology;
    }

    public getRequiredTags() {
        return [Tags.Element, Tags.Container];
    }
}