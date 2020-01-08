import { IEquatable } from "./iequatable";

export enum CodeElementRole
{
    Primary = "Primary",
    Supporting = "Supporting"
}

export class CodeElement implements IEquatable<CodeElement>{
    public role: CodeElementRole = CodeElementRole.Primary;
    public name?: string;
    public type?: string;
    public description?: string;
    public url?: string;
    public language?: string;
    public category?: string;
    public visibility?: string;
    public size: number = 0;

    public toDto(): any {
        return JSON.parse(JSON.stringify(this));
    }

    public fromDto(dto: any): CodeElement {
        const self: any = this;
        for (let field in dto) {
            self[field] = dto[field];
        }
        return this;
    }

    public equals(other: CodeElement): boolean {
        if (!other) {
            return false;
        }

        if (other === this) {
            return true;
        }

        return this.type === other.type;
    }
}