import { View } from "./view";
import { Tags } from "../model/tags";

export enum FilterMode {
    Include = "Include",
    Exclude = "Exclude"
}

export class FilteredView {
    public baseViewKey: string;
    public baseView?: View;
    public key: string;
    public description: string;
    public mode: FilterMode;
    public tags: string[];

    constructor(baseView?: View, key?: string, description?: string, mode?: FilterMode, ...tags: string[]) {
        this.baseViewKey = baseView ? baseView.key : "";
        this.baseView = baseView;
        this.key = key || "";
        this.description = description || "";
        this.mode = mode || FilterMode.Include;
        this.tags = tags;
    }

    public toDto(): any {
        return {
            key: this.key,
            description: this.description,
            mode: this.mode,
            tags: this.tags,
            baseViewKey: this.baseViewKey
        }
    }

    public fromDto(dto: any): void {
        this.key = dto.key;
        this.description = dto.description;
        this.mode = dto.mode;
        this.tags = dto.tags;
        this.baseViewKey = dto.baseViewKey;
    }
}