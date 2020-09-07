import { Workspace, SystemContextView, ContainerView, DeploymentView, View, Element, RelationshipView, Person, SoftwareSystem, Container, Relationship, ComponentView, Component, StaticView, StaticStructureElement } from "../../core";
import { DeploymentNode } from "../../core/model/deploymentNode";
import { ContainerInstance } from "../../core/model/containerInstance";

class StringWriter {
    private value = "";

    public write(content: string): void {
        this.value += content;
    }

    public writeLine(content: string): void {
        this.write(content);
        this.newline();
    }

    public newline(): void {
        this.write("\r\n");
    }

    public toString(): string {
        return this.value;
    }
}

export class PlantUMLWriter {
    public toPlantUML(workspace: Workspace): string {
        let result = new StringWriter();

        if (workspace) {
            workspace.views.systemContextViews.forEach(v => {
                this.writeSystemContextView(v, result);
            });
            workspace.views.containerViews.forEach(v => {
                this.writeContainerView(v, result);
            });
            workspace.views.componentViews.forEach(v => {
                this.writeComponentView(v, result);
            });
            workspace.views.deploymentViews.forEach(v => {
                this.writeDeploymentView(v, result);
            });
        }

        return result.toString();
    }

    private writeSystemContextView(v: SystemContextView, writer: StringWriter) {
        this.writeHeader(v, writer);

        v.elements
            .map(e => e.element)
            .sort(this.by(e => e.name))
            .forEach(e => this.writeElement(e, writer, false));

        this.writeRelationships(v.relationships, writer);

        this.writeFooter(writer);
    }

    private writeContainerView(v: ContainerView, writer: StringWriter) {
        this.writeStaticView(v, Container.type, v.softwareSystem!, writer);
    }

    private writeComponentView(v: ComponentView, writer: StringWriter) {
        this.writeStaticView(v, Component.type, v.container!, writer);
    }

    private writeStaticView(v: StaticView, type: string, element: StaticStructureElement, writer: StringWriter){
        this.writeHeader(v, writer);

        v.elements
            .map(e => e.element)
            .filter(e => e.type !== type)
            .sort(this.by(e => e.name))
            .forEach(e => this.writeElement(e, writer, false));

        writer.writeLine("package " + this.nameOf(element!.name) + " {");

        v.elements
        .map(e => e.element)
        .filter(e => e.type === type)
        .sort(this.by(e => e.name))
        .forEach(e => this.writeElement(e, writer, true));

        writer.writeLine("}");

        this.writeRelationships(v.relationships, writer);

        this.writeFooter(writer);
    }

    private writeDeploymentView(v: DeploymentView, writer: StringWriter) {
        this.writeHeader(v, writer);

        v.elements
            .filter(e => e.element.type === DeploymentNode.type && !e.element.parent)
            .map(e => <DeploymentNode>e.element)
            .sort(this.by(e => e.name))
            .forEach(e => this.writeDeploymentNode(e, writer, 0));

        this.writeRelationships(v.relationships, writer);

        this.writeFooter(writer);
    }

    private writeDeploymentNode(e: DeploymentNode, writer: StringWriter, indent: number): void {

        writer.writeLine(`${"  ".repeat(indent)}node \"${e.name + (e.instances > 1 ? " (x" + e.instances + ")" : "")}\" <<${this.typeOf(e)}>> as ${e.id} {`);

        e.children.forEach(d => this.writeDeploymentNode(d, writer, indent + 1));

        e.containerInstances.forEach(i => this.writeContainerInstance(i, writer, indent + 1));

        writer.writeLine("  ".repeat(indent) + "}");
    }

    private writeContainerInstance(i: ContainerInstance, writer: StringWriter, indent: number): void {
        writer.writeLine(`${"  ".repeat(indent)}artifact \"${i.container!.name}\" <<${this.typeOf(i)}>> as ${i.id}`);
    }

    private writeElement(e: Element, writer: StringWriter, indent: boolean): void {
        writer.writeLine(`${(indent ? "  " : "")}${(e.type === Person.type ? "actor" : "component")} \"${e.name}\" <<${this.typeOf(e)}>> as ${e.id}`);
    }

    writeRelationships(relationships: RelationshipView[], writer: StringWriter) {
        relationships.map(r => r.relationship)
            .sort(this.by(r => r.source.name + r.destination.name))
            .forEach(r => this.writeRelationship(r, writer));
    }

    writeRelationship(r: Relationship, writer: StringWriter) {
        writer.writeLine(`${r.source.id} ..> ${r.destination.id} ${(r.description && r.description.length ? ": " + r.description : "")}${(r.technology && r.technology.length ? " <<" + r.technology + ">>" : "")}`);
    }

    private writeHeader(v: View, writer: StringWriter) {
        writer.write("@startuml");
        writer.newline();

        writer.write("title " + v.name);
        writer.newline();

        if (v.description) {
            writer.write("caption " + v.description);
            writer.newline();
        }
    }

    private by<TItem, TProperty>(value: (i: TItem) => TProperty): (a: TItem, b: TItem) => number {
        return (a, b) => {
            var va = value(a);
            var vb = value(b);
            return va > vb ? 1 : va < vb ? -1 : 0;
        };
    }

    private typeOf(e: Element): string {
        if (e.type === Person.type) {
            return "Person";
        }

        if (e.type === SoftwareSystem.type) {
            return "Software System";
        }

        if (e.type === Container.type) {
            return "Container";
        }

        if (e.type === DeploymentNode.type) {
            const deploymentNode = <DeploymentNode>e;
            return deploymentNode.technology && deploymentNode.technology.length ? deploymentNode.technology : "Deployment Node";
        }

        if (e.type === ContainerInstance.type) {
            return "Container";
        }

        return "";
    }

    private nameOf(s: string): string {
        return s ? `"${s}"` : "";
    }

    private writeFooter(writer: StringWriter) {
        writer.write("@enduml");
        writer.newline();
        writer.newline();
    }
}