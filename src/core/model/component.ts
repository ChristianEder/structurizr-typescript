import { StaticStructureElement } from "./staticStructureElement";
import { IEquatable } from "./iequatable";
import { Container } from "./container";
import { CodeElement, CodeElementRole } from "./codeElement";
import { Element } from "./element";
import { Tags } from "./tags";

export class Component extends StaticStructureElement implements IEquatable<Component>{

    public static type = "Component";
    public get type(): string { return Component.type; }

    public parent!: Element | null;

    public technology?: string;
    public size: number = 0;
    public codeElements: CodeElement[] = [];

    public get primaryCodeElement(): CodeElement | null {
        return this.codeElements.find(c => c.role === CodeElementRole.Primary) || null;
    }

    public get primaryType(): string | null {
        return this.primaryCodeElement?.type || null;
    }

    public set primaryType(value: string | null) {

        if (value === this.primaryType) {
            return;
        }

        this.codeElements = this.codeElements.filter(c => c.role !== CodeElementRole.Primary);

        if (value && value.trim().length) {
            const primaryCodeElement = new CodeElement();
            primaryCodeElement.type = value;
            primaryCodeElement.name = value;
            primaryCodeElement.role = CodeElementRole.Primary;
            this.codeElements.push(primaryCodeElement);
        }
    }

    public addSupportingType(type: string, name?: string): CodeElement {
        const codeElement = new CodeElement();
        codeElement.type = type;
        codeElement.name =  name || type;
        codeElement.role = CodeElementRole.Supporting;

        if (!this.codeElements.some(c => c.equals(codeElement))) {
            this.codeElements.push(codeElement);
        }
        return codeElement;
    }

    public get container(): Container | null {
        return this.parent as Container;
    }

    public get canonicalName(): string {
        return this.parent!.canonicalName + Element.CanonicalNameSeparator + super.formatForCanonicalName(this.name);
    }

    public toDto() {
        var dto = super.toDto();
        dto.technology = this.technology;
        dto.size = this.size;
        dto.code = this.codeElements.map(c => c.toDto());
        return dto;
    }

    public fromDto(dto: any) {
        super.fromDto(dto);
        this.technology = dto.technology;
        this.size = dto.size;
        this.codeElements = dto.code ? dto.code.map((c: any) => new CodeElement().fromDto(c)) : [];
    }

    public getRequiredTags() {
        return [Tags.Element, Tags.Component];
    }
}