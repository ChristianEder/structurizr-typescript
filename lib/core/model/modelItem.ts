import { Tags } from "./tags";

export abstract class ModelItem {
    public id!: string;

    private _tags: Tags = new Tags(this);
    public get tags(): Tags {
        return this._tags;
    }

    public toDto(): any {
        return {
            id: this.id,
            tags: this.tags.toDto(),
            properties: {}
        }
    }

    public fromDto(dto: any) {
        this.id = dto.id;
        this.tags.fromDto(dto.tags);
    }

    public getRequiredTags(): string[] {
        return [];
    }
}