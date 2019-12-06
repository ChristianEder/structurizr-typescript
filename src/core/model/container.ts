import { StaticStructureElement } from "./staticStructureElement";
import { IEquatable } from "./iequatable";
import { SoftwareSystem } from "./softwareSystem";
import { Element } from "./element";
import { Tags } from "./tags";
import { Component } from "./component";

export class Container extends StaticStructureElement implements IEquatable<Container>{

    public static type = "Container";
    public get type(): string { return Container.type; }

    public parent!: Element | null;

    public technology?: string;

    public components: Component[] = [];

    public get softwareSystem(): SoftwareSystem | null {
        return this.parent as SoftwareSystem;
    }

    public get canonicalName(): string {
        return this.parent!.canonicalName + Element.CanonicalNameSeparator + super.formatForCanonicalName(this.name);
    }

    public addComponent(name: string, description: string, type?: string, technology?: string): Component | null {
        return this.model.addComponent(this, name, description, type, technology);
    }

    public toDto() {
        var dto = super.toDto();
        dto.technology = this.technology;
        dto.components = this.components.map(c => c.toDto());
        return dto;
    }

    public fromDto(dto: any) {
        super.fromDto(dto);
        this.technology = dto.technology;
        this.components = dto.components ? dto.components.map((cd: any) => {
            var c = new Component();
            c.fromDto(cd);
            c.parent = this;
            return c;
        }) : []
    }

    public getRequiredTags() {
        return [Tags.Element, Tags.Container];
    }
}