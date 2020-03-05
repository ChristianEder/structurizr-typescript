import { Styles } from "./styles";
import { Terminology } from "./terminology";
import { Branding } from "./branding";

export class ViewConfiguration {
    public styles: Styles = new Styles();

    public theme?: string;

    public terminology: Terminology = {};
    public branding: Branding = {};

    public toDto(): any {
        return {
            styles: this.styles.toDto(),
            branding: this.branding,
            terminology: this.terminology,
            viewSortOrder: "Default",
            theme: this.theme
        };
    }

    public fromDto(dto: any): void {
        if (dto.styles) {
            this.styles.fromDto(dto.styles);
        }
        if (dto.terminology) {
            this.terminology = dto.terminology;
        }
        if (dto.branding) {
            this.branding = dto.branding;
        }
        this.theme = dto.theme;
    }
}