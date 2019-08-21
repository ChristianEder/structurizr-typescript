import { DeploymentElement } from "./deploymentElement";
import { Element } from "./element";
import { ContainerInstance } from "./containerInstance";
import { Container } from "./container";
import { Relationship } from "./relationship";

export class DeploymentNode extends DeploymentElement {

    private _parent?: DeploymentNode | null;
    public get parent(): Element | null {
        return <Element | null>this._parent;
    }
    public set parent(p: Element | null) {
        this._parent = p && p.type == DeploymentNode.type ? <DeploymentNode><unknown>p : null;
    }

    public static type = "DeploymentNode";
    public get type(): string { return DeploymentNode.type; }

    public get canonicalName(): string {
        return this.parent
            ? this.parent.canonicalName + Element.CanonicalNameSeparator + super.formatForCanonicalName(this.name)
            : Element.CanonicalNameSeparator + "Deployment" + Element.CanonicalNameSeparator + super.formatForCanonicalName(this.environment) + Element.CanonicalNameSeparator + super.formatForCanonicalName(this.name);
    }

    public technology!: string;
    public instances!: number;
    public children: DeploymentNode[] = [];
    public containerInstances: ContainerInstance[] = [];

    public add(container: Container): ContainerInstance {
        var containerInstance = this.model.addContainerInstance(this, container);
        this.containerInstances.push(containerInstance);
        return containerInstance;
    }

    public addDeploymentNode(name: string, description: string, technology: string, instances = 1): DeploymentNode | null {
        var node = this.model.addDeploymentNode(name, description, technology, this, this.environment, instances);
        if (node) {
            this.children.push(node);
        }
        return node;
    }

    public uses(destination: DeploymentNode, description: string, technology: string): Relationship | null {
        return this.model.addRelationship(this, destination, description, technology);
    }

    public toDto(): any {
        var dto = super.toDto();
        
        return {
            ...dto,
            environment: this.environment,
            technology: this.technology,
            instances: this.instances,
            children: this.children.map(h => h.toDto()),
            containerInstances: this.containerInstances.map(h => h.toDto())
        };
    }

    public fromDto(dto: any) {
        super.fromDto(dto);
        this.environment = dto.environment;
        this.technology = dto.technology;
        this.instances = dto.instances;
        this.children = dto.children ? dto.children.map((h: any) => {
            var c = new DeploymentNode();
            c.fromDto(h);
            return c;
        }) : [];
        this.containerInstances = dto.containerInstances ? dto.containerInstances.map((h: any) => {
            var c = new ContainerInstance();
            c.fromDto(h);
            return c;
        }) : [];
    }
}