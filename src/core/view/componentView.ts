import { StaticView } from "./staticView";
import { SoftwareSystem } from "../model/softwareSystem";
import { Person } from "../model/person";
import { Container } from "../model/container";
import { Element } from "../model/element";
import { Component } from "../model/component";

export class ComponentView extends StaticView {

    public containerId?: string;

    public get name(): string {
        return this.softwareSystem!.name + " - " + this.container!.name + " - Components";
    }

    constructor(public container?: Container, key?: string, description?: string) {
        super(container && container.softwareSystem ? container.softwareSystem : undefined, key, description);

        if(container){
            this.containerId = container.id;
        }
    }

    public addAllElements(): void {
        this.addAllSoftwareSystems();
        this.addAllPeople();
        this.addAllContainers();
        this.addAllComponents();
    }

    public addAllComponents() {
        this.container?.components.forEach(c => this.addElement(c, true));
    }

    public addNearestNeighbours(element: Element): void {
        this.addNearestNeighboursOfType(element, Person.type);
        this.addNearestNeighboursOfType(element, SoftwareSystem.type);
        this.addNearestNeighboursOfType(element, Container.type);
        this.addNearestNeighboursOfType(element, Component.type);
    }

    public addComponent(component: Component) {
        if (component.container != this.container) {
            return;
        }
        this.addElement(component, true);
    }

    protected addElement(element: Element, addRelationships: boolean): void {
        if (element === this.softwareSystem || element === this.container) {
            return;
        }

        super.addElement(element, addRelationships);
    }

    public toDto(): any {
        var dto = super.toDto();
        dto.containerId = this.containerId;
        return dto;
    }

    public fromDto(dto: any): void {
        super.fromDto(dto);
        this.containerId = dto.containerId;
    }
}