import { Routing } from "./relationshipView";

export enum Shape {
    Box = "Box",
    RoundedBox = "RoundedBox",
    Circle = "Circle",
    Ellipse = "Ellipse",
    Hexagon = "Hexagon",
    Cylinder = "Cylinder",
    Pipe = "Pipe",
    Person = "Person",
    Robot = "Robot",
    Folder = "Folder",
    WebBrowser = "WebBrowser",
    MobileDevicePortrait = "MobileDevicePortrait",
    MobileDeviceLandscape = "MobileDeviceLandscape"
}

export enum Border {
    Solid = "Solid",
    Dashed = "Dashed"
}

export interface IRelationshipStyle {
    thickness?: number;
    color?: string;
    fontSize?: number;
    width?: number;
    dashed?: boolean;
    routing?: Routing;
    opacity?: number;
    position?: number;
}

export class RelationshipStyle implements IRelationshipStyle {

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

export interface IElementStyle {
    width?: number;
    height?: number;
    background?: string;
    color?: string;
    stroke?: string;
    fontSize?: number;
    shape?: Shape;
    icon?: string;
    border?: Border;
    opacity?: number;
    metadata?: boolean;
    description?: boolean;
}

export class ElementStyle implements IElementStyle {
    public width?: number;
    public height?: number;
    public background?: string;
    public color?: string;
    public stroke?: string;
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

export interface ITheme {
    relationships: IRelationshipStyle[];
    elements: IElementStyle[];
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

    public toTheme(): ITheme {
        return {
            elements: this.elements,
            relationships: this.relationships
        };
    }
}