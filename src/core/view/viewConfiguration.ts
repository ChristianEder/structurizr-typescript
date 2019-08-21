import { Styles } from "./styles";

export class ViewConfiguration {
    public styles: Styles = new Styles();

    public toDto(): any {
        return {
            styles: this.styles.toDto(),
            branding: {},
            terminology: {},
            viewSortOrder: "Default"
        };
    }

    public fromDto(dto: any): void {
        if (dto.styles) {
            this.styles.fromDto(dto.styles);
        }
    }
}