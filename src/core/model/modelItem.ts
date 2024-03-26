import { Tags } from "./tags";

export abstract class ModelItem {
    public id!: string;
    public properties!: Record<string, string>;

    private _tags: Tags = new Tags(this);
    public get tags(): Tags {
        return this._tags;
    }

    public toDto(): any {
        return {
            id: this.id,
            tags: this.tags.toDto(),
            properties: this.properties
        }
    }

    public fromDto(dto: any) {
        this.id = dto.id;
        this.properties = dto.properties ?? {};
        this.tags.fromDto(dto.tags);
    }

    public getRequiredTags(): string[] {
        return [];
    }
}