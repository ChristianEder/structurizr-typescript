import { View } from "./view";
import { SoftwareSystem } from "../model/softwareSystem";
import { Person } from "../model/person";
import { Element } from "../model/element";

export abstract class StaticView extends View {

    public toDto(): any {
        var dto = super.toDto();
        dto.animations = [];
        return dto;
    }

    public abstract addAllElements(): void;
    public abstract addNearestNeighbours(element: Element): void;

    public addAllSoftwareSystems(): void {
        this.model.softwareSystems.forEach(s => {
            this.addSoftwareSystem(s);
        });
    }

    public addAllPeople(): void {
        this.model.people.forEach(p => {
            this.addPerson(p);
        })
    }

    public addSoftwareSystem(softwareSystem: SoftwareSystem) {
        this.addElement(softwareSystem, true);
    }

    public addPerson(person: Person) {
        this.addElement(person, true);
    }

    public addNearestNeighboursOfType(element: Element, typeOfElement: string): void {
        if (!element) {
            return;
        }
        this.addElement(element, true);

        this.model.relationships.forEach(r => {
            if (r.source.equals(element) && r.destination.type == typeOfElement) {
                this.addElement(r.destination, true);
            }

            if (r.destination.equals(element) && r.source.type == typeOfElement) {
                this.addElement(r.source, true);
            }
        });
    }
}