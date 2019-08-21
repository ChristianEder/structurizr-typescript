import { StaticStructureElement } from "./staticStructureElement";
import { IEquatable } from "./iequatable";
import { Element } from "./element";
import { Location } from "./location";
import { Tags } from "./tags";
import { Container } from "./container";

export class SoftwareSystem extends StaticStructureElement implements IEquatable<SoftwareSystem>{

    public static type = "SoftwareSystem";
    public get type(): string { return SoftwareSystem.type; }

    public get parent(): Element | null { return null; }
    public set parent(p: Element | null) { }

    public location = Location.Unspecified;

    public containers: Container[] = [];

    public get canonicalName(): string {
        return Element.CanonicalNameSeparator + super.formatForCanonicalName(this.name);
    }

    public toDto() {
        var dto = super.toDto();
        dto.location = this.location;
        dto.containers = this.containers.map(c => c.toDto());
        return dto;
    }

    public fromDto(dto: any) {
        super.fromDto(dto);
        this.location = dto.location;
        this.containers = dto.containers
            ? dto.containers.map((containerDto: any) => {
                var c = new Container();
                c.parent = this;
                c.fromDto(containerDto);
                return c;
            })
            : [];
    }

    public getRequiredTags() {
        return [Tags.Element, Tags.SoftwareSystem];
    }

    public addContainer(name: string, description: string, technology: string): Container | null {
        return this.model.addContainer(this, name, description, technology);
    }

}