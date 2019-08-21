import { SoftwareSystem } from "../model/softwareSystem";
import { Model } from "../model/model";
import { ElementView } from "./elementView";
import { RelationshipView } from "./relationshipView";
import { Element } from "../model/element";
import { Relationship } from "../model/relationship";

export abstract class View {
    public key!: string;
    public description!: string;
    public title!: string;
    public softwareSystemId?: string;
    public softwareSystem?: SoftwareSystem;
    public elements: ElementView[] = [];
    public relationships: RelationshipView[] = [];

    public get model(): Model {
        return this.softwareSystem!.model;
    }
    public set model(m: Model) {
    }

    public abstract get name(): string;

    constructor(softwareSystem?: SoftwareSystem, key?: string, description?: string) {
        if (softwareSystem) {
            this.softwareSystem = softwareSystem;
            this.softwareSystemId = softwareSystem ? softwareSystem.id : undefined;
            this.key = key!;
            this.description = description!;
        }
    }

    public toDto(): any {
        return {
            key: this.key,
            description: this.description,
            softwareSystemId: this.softwareSystemId,
            title: this.title,
            elements: this.elements.map(e => e.toDto()),
            relationships: this.relationships.map(r => r.toDto())
        }
    }

    public fromDto(dto: any): void {
        this.key = dto.key;
        this.description = dto.description;
        this.softwareSystemId = dto.softwareSystemId;
        this.title = dto.title;
        this.elements = (dto.elements || []).map((elementDto: any) => {
            var e = new ElementView();
            e.fromDto(elementDto);
            return e;
        });
        this.relationships = (dto.relationships || []).map((relationshipDto: any) => {
            var r = new RelationshipView();
            r.fromDto(relationshipDto);
            return r;
        });
    }

    public add(relationship: Relationship): RelationshipView | null {
        if (relationship && this.isElementInView(relationship.source) && this.isElementInView(relationship.destination)) {
            return this._addRelationship(relationship);
        }
        return null;
    }

    public addRelationship(relationship: Relationship, description: string, order: string): RelationshipView | null {
        var view = this.add(relationship);
        if (view) {
            view.description = description;
            view.order = order;
        }
        return view;
    }

    public isElementInView(element: Element): boolean {
        return this.elements.some(e => e.element.equals(element));
    }

    public remove(relationship: Relationship) {
        if (relationship) {
            this.relationships = this.relationships.filter(r => !r.relationship.equals(relationship));
        }
    }

    public copyLayoutInformationFrom(source: View) {
        source.elements.forEach(e => {
            var target = this.elements.find(t => t.element.equals(e.element));
            if (target) {
                target.copyLayoutInformationFrom(e);
            }
        });

        source.relationships.forEach(r => {
            var target = this.relationships.find(t => t.relationship.equals(r.relationship));
            if (target) {
                target.copyLayoutInformationFrom(r);
            }
        });
    }

    protected addElement(element: Element, addRelationships: boolean): void {
        if (element) {
            if (this.model.containsElement(element)) {
                this.elements.push(new ElementView(element));
                if (addRelationships) {
                    this.addRelationships(element);
                }
            }
        }
    }

    protected removeElement(element: Element): void {
        if (element) {
            this.elements = this.elements.filter(e => !e.element.equals(element));
            this.relationships = this.relationships.filter(r => !r.relationship.source.equals(element) && !r.relationship.destination.equals(element))
        }
    }

    private addRelationships(element: Element): void {
        var elements = this.elements.map(e => e.element);
        element.relationships.forEach(r => {
            if (elements.some(e => e.equals(r.destination))) {
                this._addRelationship(r);
            }
        });
        elements.forEach(e => {
            e.relationships.forEach(r => {
                if (r.destination.equals(element)) {
                    this._addRelationship(r);
                }
            });
        });
    }

    private _addRelationship(relationship: Relationship): RelationshipView {
        var view = this.relationships.find(r => r.relationship.equals(relationship));
        if (!view) {
            view = new RelationshipView(relationship);
            this.relationships.push(view);
        }

        return view;
    }
}