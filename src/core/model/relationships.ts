import { Relationship } from "./relationship";
import { Element } from "./element";

export class Relationships {

    private _all: Relationship[] = [];

    constructor(private owner: Element) {
    }

    public add(relationship: Relationship) {
        if (!this.has(relationship)) {
            this._all.push(relationship);
        }
    }

    public has(relationship: Relationship): boolean {
        return this._all.some(r => r.equals(relationship));
    }

    public hasAfferentRelationships() {
        return this.owner.model.hasRelationshipTargeting(this.owner);
    }

    public getEfferentRelationshipWith(element: Element, description?: string): Relationship | null {
        if (!element) {
            return null;
        }

        let relationship = this._all.filter(r => r.destination.equals(element));

        if (description) {
            relationship = relationship.filter(r => r.description === description);
        }

        if (relationship.length) {
            return relationship[0];
        }
        
        return null;
    }

    public toDto(): {}[] {
        return this._all.map(r => r.toDto());
    }

    public fromDto(dto: any[]) {
        this._all = dto
            ? dto.map((relationshipDto: any) => {
                var r = new Relationship();
                r.fromDto(relationshipDto);
                return r;
            })
            : [];
    }

    public forEach(callback: (r: Relationship) => void) {
        this._all.forEach(callback);
    }
}