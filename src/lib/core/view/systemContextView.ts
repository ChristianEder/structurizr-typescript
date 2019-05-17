import { StaticView } from "./staticView";
import { SoftwareSystem } from "../model/softwareSystem";
import { Element } from "../model/element";
import { Person } from "../model/person";

export class SystemContextView extends StaticView {

    public get name(): string {
        return this.softwareSystem.name + " - System Context";
    }

    constructor(softwareSystem?: SoftwareSystem, key?: string, description?: string) {
        super(softwareSystem, key, description);
        if (softwareSystem) {
            this.addElement(softwareSystem, true);
        }
    }

    public addAllElements(): void {
        this.addAllSoftwareSystems();
        this.addAllPeople();
    }

    public addNearestNeighbours(element: Element): void {
        this.addNearestNeighboursOfType(element, SoftwareSystem.type);
        this.addNearestNeighboursOfType(element, Person.type);
    }
}