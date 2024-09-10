import { StaticView } from "./staticView";
import { SoftwareSystem } from "../model/softwareSystem";
import { Person } from "../model/person";
import { Container } from "../model/container";
import { Element } from "../model/element";

export class ContainerView extends StaticView {

    public get name(): string {
        return this.softwareSystem!.name + " - Containers";
    }

    constructor(softwareSystem?: SoftwareSystem, key?: string, description?: string) {
        super(softwareSystem, key, description);
    }

    public addAllElements(): void {
        this.addAllSoftwareSystems();
        this.addAllPeople();
        this.addAllContainers();
    }

    public addNearestNeighbours(element: Element): void {
        this.addNearestNeighboursOfType(element, Person.type);
        this.addNearestNeighboursOfType(element, SoftwareSystem.type);
        this.addNearestNeighboursOfType(element, Container.type);
    }

    public addContainer(container: Container) {
        this.addElement(container, true);
    }

    public removeContainers(condition: (c: Container) => boolean): void {
        this.removeElements(e => e.type === Container.type && condition(e as Container));
    }

    protected addElement(element: Element, addRelationships: boolean): void {
        if (element === this.softwareSystem) {
            return;
        }

        super.addElement(element, addRelationships);
    }
}