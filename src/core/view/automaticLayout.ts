import { RankDirection } from "./rankDirection";

export class AutomaticLayout {
    public rankDirection?: RankDirection;
    public rankSeparation?: number;
    public nodeSeparation?: number;
    public edgeSeparation?: number;
    public vertices?: boolean;

    toDto() {
        return {
            rankDirection: this.rankDirection,
            rankSeparation: this.rankSeparation,
            nodeSeparation: this.nodeSeparation,
            edgeSeparation: this.edgeSeparation,
            vertices: this.vertices
        };
    }

    fromDto(dto: any) {
        this.rankDirection = dto.rankDirection;
        this.rankSeparation = dto.rankSeparation;
        this.nodeSeparation = dto.nodeSeparation;
        this.edgeSeparation = dto.edgeSeparation;
        this.vertices = dto.vertices;
    }
}
