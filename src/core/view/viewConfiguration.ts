import { Styles } from "./styles";

export class ViewConfiguration {
    public styles: Styles = new Styles();

    public theme?: string;

    public toDto(): any {
        return {
            styles: this.styles.toDto(),
            branding: {},
            terminology: {},
            viewSortOrder: "Default",
            theme: this.theme
        };
    }

    public fromDto(dto: any): void {
        if (dto.styles) {
            this.styles.fromDto(dto.styles);
        }
        this.theme = dto.theme;
    }
}