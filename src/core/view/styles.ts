import { Routing } from "./relationshipView";

export enum Shape {
    Box,
    RoundedBox,
    Circle,
    Ellipse,
    Hexagon,
    Cylinder,
    Pipe,
    Person,
    Robot,
    Folder,
    WebBrowser,
    MobileDevicePortrait,
    MobileDeviceLandscape
}

export enum Border {
    Solid,
    Dashed
}

export class RelationshipStyle {

    public thickness?: number;
    public color?: string;
    public fontSize?: number;
    public width?: number;
    public dashed?: boolean;
    public routing?: Routing;
    public opacity?: number;
    public position?: number;

    constructor(public tag: string) { }

    public toDto(): any {
        return JSON.parse(JSON.stringify(this));
    }

    public fromDto(dto: any): RelationshipStyle {
        const self: any = this;
        for (let field in dto) {
            self[field] = dto[field];
        }
        return this;
    }
}

export class ElementStyle {
    public width?: number;
    public height?: number;
    public background?: string;
    public color?: string;
    public fontSize?: number;
    public shape?: Shape;
    public icon?: string;
    public border?: Border;
    public opacity?: number;
    public metadata?: boolean;
    public description?: boolean;

    constructor(public tag: string) { }

    public toDto(): any {
        return JSON.parse(JSON.stringify(this));
    }

    public fromDto(dto: any): ElementStyle {
        const self: any = this;
        for (let field in dto) {
            self[field] = dto[field];
        }
        return this;
    }
}

export class Styles {
    private relationships: RelationshipStyle[] = [];
    private elements: ElementStyle[] = [];

    public addRelationshipStyle(style: RelationshipStyle) {
        this.relationships.push(style);
     }

    public addElementStyle(style: ElementStyle) { 
        this.elements.push(style);
    }

    public toDto(): any {
        return {
            relationships: this.relationships.map(r => r.toDto()),
            elements: this.elements.map(r => r.toDto()),
        }
    }

    public fromDto(dto: any): void {
        this.relationships = (dto.relationships || []).map((r: any) => new RelationshipStyle(r.tag).fromDto(r))
        this.elements = (dto.elements || []).map((e: any) => new ElementStyle(e.tag).fromDto(e))
    }
}