import { Relationship } from "./relationship";
import { Element } from "./element";
import { InteractionStyle } from "./interactionStyle";
import { SequentialIntegerIdGeneratorStrategy } from "./sequentialIntegerIdGeneratorStrategy";
import { Location } from "./location";
import { Person } from "./person";
import { SoftwareSystem } from "./softwareSystem";
import { Container } from "./container";
import { DeploymentNode } from "./deploymentNode";
import { ContainerInstance } from "./containerInstance";
import { Component } from "./component";

export class Model {
    public relationships: Relationship[] = [];
    private _idGenerator = new SequentialIntegerIdGeneratorStrategy();
    public people: Person[] = [];
    public softwareSystems: SoftwareSystem[] = [];
    public containerInstances: ContainerInstance[] = [];
    public deploymentNodes: DeploymentNode[] = [];
    private _elementsById: { [id: string]: Element } = {};

    public toDto(): any {
        return {
            people: this.people.map(p => p.toDto()),
            softwareSystems: this.softwareSystems.map(s => s.toDto()),
            deploymentNodes: this.deploymentNodes.map(d => d.toDto())
        };
    }

    public fromDto(dto: any) {
        if (dto.people) {
            this.people = dto.people.map((personDto: any) => {
                var p = new Person();
                p.fromDto(personDto);
                return p;
            });
        }
        if (dto.softwareSystems) {
            this.softwareSystems = dto.softwareSystems.map((softwareSystemDto: any) => {
                var s = new SoftwareSystem();
                s.fromDto(softwareSystemDto);
                return s;
            });
        }
        if (dto.deploymentNodes) {
            this.deploymentNodes = dto.deploymentNodes.map((deploymentNodeDto: any) => {
                var d = new DeploymentNode();
                d.fromDto(deploymentNodeDto);
                return d;
            });
        }
    }

    public hydrate(): void {
        this.people.forEach(p => this.addElementToInternalStructures(p));
        this.softwareSystems.forEach(s => {
            this.addElementToInternalStructures(s);
            s.containers.forEach(c => {
                this.addElementToInternalStructures(c);
                c.components.forEach(co => {
                    this.addElementToInternalStructures(co);
                });
            });
        });

        this.deploymentNodes.forEach(n => this.hydrateDeploymentNode(n, null));

        this.people.forEach(p => this.hydrateRelationships(p));
        this.softwareSystems.forEach(s => {
            this.hydrateRelationships(s);
            s.containers.forEach(c => {
                this.hydrateRelationships(c);
                c.components.forEach(co => this.hydrateRelationships(co));
            });
        });

        this.deploymentNodes.forEach(n => this.hydrateDeploymentNodeRelationships(n));
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
            return relationship;
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

    public addContainer(parent: SoftwareSystem, name: string, description: string, technology: string): Container | null {
        if (parent.containers.some(c => c.name == name)) {
            return null;
        }

        var container = new Container();
        container.name = name;
        container.description = description;
        container.technology = technology;
        container.parent = parent;
        parent.containers.push(container);
        container.id = this._idGenerator.generateId(container);
        this.addElementToInternalStructures(container);
        return container;
    }

    public addComponent(parent: Container, name: string, description: string, type?: string, technology?: string): Component | null {
        if (parent.components.some(c => c.name == name)) {
            return null;
        }

        var component = new Component();
        component.name = name;
        component.description = description;
        component.technology = technology;
        component.parent = parent;

        if (type) {
            component.primaryType = type;
        }

        parent.components.push(component);
        component.id = this._idGenerator.generateId(component);
        this.addElementToInternalStructures(component);
        return component;
    }

    public addContainerInstance(deploymentNode: DeploymentNode, container: Container): ContainerInstance {
        var instanceNumber = this.containerInstances.filter(i => i.container!.equals(container)).length + 1;
        var instance = new ContainerInstance();
        instance.container = container;
        instance.containerId = container.id;
        instance.instanceId = instanceNumber;
        instance.environment = deploymentNode.environment;
        instance.id = this._idGenerator.generateId(instance);

        var instancesInSameEnvironment = this.containerInstances.filter(f => f.environment === deploymentNode.environment);
        instancesInSameEnvironment.forEach(i => {

            var c = i.container!;
            container.relationships.forEach(r => {
                if (r.destination.equals(c)) {
                    var newRelation = this.addRelationship(instance, i, r.description, r.technology, r.interactionStlye);
                    if (newRelation) {
                        newRelation.tags.clear();
                        newRelation.linkedRelationshipId = r.id;
                    }
                }
            });


            c.relationships.forEach(r => {
                if (r.destination.equals(container)) {
                    var newRelation = this.addRelationship(i, instance, r.description, r.technology, r.interactionStlye);
                    if (newRelation) {
                        newRelation.tags.clear();
                        newRelation.linkedRelationshipId = r.id;
                    }
                }
            });
        });

        this.addElementToInternalStructures(instance);
        this.containerInstances.push(instance);
        return instance;
    }

    public addDeploymentNode(name: string, description: string, technology: string, parent: DeploymentNode | null = null, environment = "Default", instances = 1): DeploymentNode | null {

        var nodes = parent ? parent.children : this.deploymentNodes;

        if (nodes.some(c => c.name == name && c.environment == environment)) {
            return null;
        }

        var node = new DeploymentNode();
        node.name = name;
        node.description = description;
        node.technology = technology;
        node.environment = environment;
        node.instances = instances;
        node.parent = parent;

        if (!parent) {
            this.deploymentNodes.push(node);
        }
        node.id = this._idGenerator.generateId(node);
        this.addElementToInternalStructures(node);
        return node;
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

    private hydrateDeploymentNode(deploymentNode: DeploymentNode, parent: DeploymentNode | null) {
        deploymentNode.parent = parent;
        this.addElementToInternalStructures(deploymentNode);

        deploymentNode.children.forEach(child => this.hydrateDeploymentNode(child, deploymentNode));

        deploymentNode.containerInstances.forEach(containerInstance => {
            containerInstance.container = <Container>this._elementsById[containerInstance.containerId!];
            this.addElementToInternalStructures(containerInstance);
        });
    }

    private hydrateDeploymentNodeRelationships(deploymentNode: DeploymentNode) {
        this.hydrateRelationships(deploymentNode);
        deploymentNode.children.forEach(child => this.hydrateDeploymentNodeRelationships(child));
        deploymentNode.containerInstances.forEach(c => this.hydrateRelationships(c));
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