import { ModelItem } from "./modelItem";
import { IEquatable } from "./iequatable";
import { Element } from "./element";
import { InteractionStyle } from "./interactionStyle";
import { Tags } from "./tags";

export class Relationship extends ModelItem implements IEquatable<Relationship> {

    public description!: string;
    public technology?: string;
    public interactionStlye = InteractionStyle.Synchronous;
    public sourceId!: string;
    public source!: Element;
    public destinationId!: string;
    public destination!: Element;
    public linkedRelationshipId?: string;

    constructor(source?: Element, destination?: Element, description?: string, technology?: string, interactionStyle: InteractionStyle = InteractionStyle.Synchronous) {
        super();
        if (source) {
            this.source = source;
            this.sourceId = source.id;
        }

        if (destination) {
            this.destination = destination;
            this.destinationId = destination.id;
        }

        if (description) {
            this.description = description;
        }
        
        this.technology = technology;
        this.interactionStlye = interactionStyle;
        if (interactionStyle == InteractionStyle.Synchronous) {
            this.tags.add(Tags.Synchronous);
        } else {
            this.tags.add(Tags.Asynchronous);
        }
    }

    public toDto(): {} {
        var dto = super.toDto();
        dto.description = this.description;
        if (this.technology) {
            dto.technology = this.technology;
        }
        if (this.interactionStlye != InteractionStyle.Synchronous) {
            dto.interactionStlye = this.interactionStlye;
        }
        dto.sourceId = this.sourceId;
        dto.destinationId = this.destinationId;
        if (this.linkedRelationshipId) {
            dto.linkedRelationshipId = this.linkedRelationshipId;
        }
        return dto;
    }

    public fromDto(dto: any) {
        super.fromDto(dto);
        this.description = dto.description;
        this.technology = dto.technology;
        this.interactionStlye = dto.interactionStlye;
        this.linkedRelationshipId = dto.linkedRelationshipId;
        this.sourceId = dto.sourceId;
        this.destinationId = dto.destinationId;
    }

    public getRequiredTags(): string[] {
        if (!this.linkedRelationshipId) {
            return [Tags.Relationship];
        }
        return [];
    }

    equals(other: Relationship): boolean {
        if (!other) {
            return false;
        }

        if (this.description !== other.description) {
            return false;
        }

        if (!this.destination.equals(other.destination)) {
            return false;
        }

        if (!this.source.equals(other.source)) {
            return false;
        }

        return true;
    }

}