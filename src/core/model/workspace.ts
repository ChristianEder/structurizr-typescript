import { Model } from "./model";
import { ViewSet } from "../view/viewSet";

export abstract class AbstractWorkspace {
    public id!: number;
    public name: string = "";
    public description: string = "";
    public lastModifiedDate!: Date;
    public version!: string;

    public toDto(): any {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            lastModifiedDate: this.lastModifiedDate,
            version: this.version,
            documentation: {
                sections: [],
                decisions: [],
                images: []
            },
            configuration: {
                users: []
            }
        };
    }

    public fromDto(dto: any) {
        this.id = dto.id;
        this.name = dto.name;
        this.description = dto.description;
        this.lastModifiedDate = dto.lastModifiedDate;
        this.version = dto.version;
    }
}

export class Workspace extends AbstractWorkspace {
    public model: Model = new Model();
    public views: ViewSet = new ViewSet(this.model);

    public toDto(): any {
        var dto = super.toDto();
        dto.model = this.model.toDto();
        dto.views = this.views.toDto();
        return dto;
    }

    public fromDto(dto: any) {
        super.fromDto(dto);
        this.model.fromDto(dto.model);
        this.views.fromDto(dto.views);
    }

    public hydrate(): void {
        this.model.hydrate();
        this.views.hydrate();
    }

}