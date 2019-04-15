import { StaticView } from "./staticView";
import { SoftwareSystem } from "../model/softwareSystem";
import { Person } from "../model/person";
import { Container } from "../model/container";
import { Element } from "../model/element";

export class ContainerView extends StaticView {

    public get name(): string {
        return this.softwareSystem.name + " - Containers";
    }

    constructor(softwareSystem?: SoftwareSystem, key?: string, description?: string) {
        super(softwareSystem, key, description);
    }

    public addAllElements(): void {
        this.addAllSoftwareSystems();
        this.addAllPeople();
        this.addAllContainers();
    }

    public addAllContainers(): void {
        this.softwareSystem.containers.forEach(c => this.addElement(c, true));
    }

    public addNearestNeighbours(element: Element): void {
        this.addNearestNeighboursOfType(element, Person.type);
        this.addNearestNeighboursOfType(element, SoftwareSystem.type);
        this.addNearestNeighboursOfType(element, Container.type);
    }
}