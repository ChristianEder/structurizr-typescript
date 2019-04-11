import { Relationship } from "./relationship";
import { Element } from "./element";
import { InteractionStyle } from "./interactionStyle";
import { SequentialIntegerIdGeneratorStrategy } from "./sequentialIntegerIdGeneratorStrategy";
import { Location } from "./location";
import { Person } from "./person";

export class Model {
    private _relationships: Relationship[] = [];
    private _idGenerator = new SequentialIntegerIdGeneratorStrategy();
    private _people: Person[] = [];
    private _elementsById: { [id: string]: Element } = {};

    public toDto(): any {
        return {
            people: this._people.map(p => p.toDto()),
            softwareSystems: [],
            deploymentNodes: []
        };
    }

    public fromDto(dto: any) {
        // TODO this._people = dto.people;
    }

    public hasRelationshipTargeting(target: Element): boolean {
        return this._relationships.some(r => r.destination.equals(target));
    }

    public addRelationship(source: Element, destination: Element, description: string, technology?: string, interactionStyle = InteractionStyle.Synchronous): Relationship | null {
        var relationship = new Relationship(source, destination, description, technology, interactionStyle);

        if (!source.relationships.has(relationship)) {
            relationship.id = this._idGenerator.generateId(relationship);
            source.relationships.add(relationship);
            this.addRelationshipToInternalStructures(relationship);
        }

        return null;
    }

    public addPerson(name: string, description: string, location: Location = Location.Unspecified): Person | null {
        if (!this.getPersonWithName(name)) {
            var person = new Person();
            person.name = name;
            person.description = description;
            person.location = location;
            this._people.push(person);
            person.id = this._idGenerator.generateId(person);
            this.addElementToInternalStructures(person);
            return person;
        }
        return null;
    }

    private addRelationshipToInternalStructures(relationship: Relationship) {
        this._relationships.push(relationship);
        this._idGenerator.found(relationship.id);
    }

    private addElementToInternalStructures(element: Element) {
        this._elementsById[element.id] = element;
        element.model = this;
        this._idGenerator.found(element.id);
    }

    private hydrateRelationships(element: Element) {
        element.relationships.forEach(r => {
            r.source = this.getElement(r.sourceId);
            r.destination = this.getElement(r.destinationId);
            this.addRelationshipToInternalStructures(r);
        });
    }

    private getElement(id: string): Element {
        return this._elementsById[id];
    }

    private getPersonWithName(name: string): Person | null {
        for (var i = 0; i < this._people.length; i++) {
            if (this._people[i].name == name) {
                return this._people[i];
            }
        }
        return null;
    }
}