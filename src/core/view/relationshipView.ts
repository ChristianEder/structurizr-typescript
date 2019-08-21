import { IEquatable } from "../model/iequatable";
import { Relationship } from "../model/relationship";
import { runInThisContext } from "vm";

export enum Routing {
    Direct = "Direct",
    Orthogonal = "Orthogonal"
}

export class RelationshipView implements IEquatable<RelationshipView>{
    public relationship!: Relationship;
    public id!: string;
    public order?: string;
    public description!: string;
    public vertices: { x?: number, y?: number }[] = [];
    public routing?: Routing;

    protected get type(): string {
        return "RelationshipView";
    }

    private _position?: number = undefined;
    public get position(): number | undefined {
        return this._position;
    }
    public set position(value: number | undefined) {
        if (value != undefined) {
            if (value < 0) {
                this._position = 0;
            }
            else if (value > 100) {
                this._position = 100;
            }
            else {
                this._position = value;
            }
        }
    }

    constructor(relationship?: Relationship) {
        if (relationship) {
            this.relationship = relationship;
            this.id = relationship.id;
        }
    }

    public equals(other: RelationshipView): boolean {
        if (!other) {
            return false;
        }

        if (other === this) {
            return true;
        }

        if (other.type !== this.type) {
            return false;
        }

        if (this.description != other.description) {
            return false;
        }

        if (this.id != other.id) {
            return false;
        }

        return !(this.order != undefined ? this.order != other.order : other.order != undefined)
    }

    public copyLayoutInformationFrom(source: RelationshipView) {
        if (source) {
            this.vertices = source.vertices;
            this.routing = source.routing;
            this.position = source.position;
        }
    }

    public toDto(): any {
        return {
            id: this.id,
            order: this.order,
            description: this.description,
            vertices: this.vertices,
            routing: this.routing,
            position: this.position
        }
    }


    public fromDto(dto: any): void {
        this.id = dto.id;
        this.order = dto.order;
        this.description = dto.description;
        this.vertices = dto.vertices;
        this.routing = dto.routing
        this.position = dto.position;
    }
}