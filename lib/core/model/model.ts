import { Relationship } from "./relationship";
import { Element } from "./element";
import { InteractionStyle } from "./interactionStyle";
import { SequentialIntegerIdGeneratorStrategy } from "./sequentialIntegerIdGeneratorStrategy";
import { Location } from "./location";
import { Person } from "./person";
import { SoftwareSystem } from "./softwareSystem";

export class Model {
    public relationships: Relationship[] = [];
    private _idGenerator = new SequentialIntegerIdGeneratorStrategy();
    public people: Person[] = [];
    public softwareSystems: SoftwareSystem[] = [];
    private _elementsById: { [id: string]: Element } = {};

    public toDto(): any {
        return {
            people: this.people.map(p => p.toDto()),
            softwareSystems: this.softwareSystems.map(s => s.toDto()),
            deploymentNodes: []
        };
    }

    public fromDto(dto: any) {
        this.people = dto.people.map((personDto: any) => {
            var p = new Person();
            p.fromDto(personDto);
            return p;
        });
        this.softwareSystems = dto.softwareSystems.map((softwareSystemDto: any) => {
            var s = new SoftwareSystem();
            s.fromDto(softwareSystemDto);
            return s;
        });
    }

    public hydrate(): void {
        this.people.forEach(p => this.addElementToInternalStructures(p));
        this.softwareSystems.forEach(s => this.addElementToInternalStructures(s));

        this.people.forEach(p => this.hydrateRelationships(p));
        this.softwareSystems.forEach(s => this.hydrateRelationships(s));
    }

    public hasRelationshipTargeting(target: Element): boolean {
        return this.relationships.some(r => r.destination.equals(target));
    }

    public containsElement(element: Element): boolean {
        return this.getElement(element.id) == element;
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
        if (this.getPersonWithName(name)) {
            return null;
        }
        var person = new Person();
        person.name = name;
        person.description = description;
        person.location = location;
        this.people.push(person);
        person.id = this._idGenerator.generateId(person);
        this.addElementToInternalStructures(person);
        return person;
    }

    public addSoftwareSystem(name: string, description: string, location: Location = Location.Unspecified): SoftwareSystem | null {
        if (this.getSoftwareSystemWithName(name)) {
            return null;
        }

        var softwareSystem = new SoftwareSystem();
        softwareSystem.name = name;
        softwareSystem.description = description;
        softwareSystem.location = location;
        this.softwareSystems.push(softwareSystem);
        softwareSystem.id = this._idGenerator.generateId(softwareSystem);
        this.addElementToInternalStructures(softwareSystem);
        return softwareSystem;
    }

    public getElement(id: string): Element {
        return this._elementsById[id];
    }

    public getRelationship(id: string): Relationship | undefined {
        return this.relationships.find(r => r.id == id);
    }

    private addRelationshipToInternalStructures(relationship: Relationship) {
        this.relationships.push(relationship);
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

    private getPersonWithName(name: string): Person | null {
        for (var i = 0; i < this.people.length; i++) {
            if (this.people[i].name == name) {
                return this.people[i];
            }
        }
        return null;
    }

    private getSoftwareSystemWithName(name: string): SoftwareSystem | null {
        for (var i = 0; i < this.softwareSystems.length; i++) {
            if (this.softwareSystems[i].name == name) {
                return this.softwareSystems[i];
            }
        }
        return null;
    }
}