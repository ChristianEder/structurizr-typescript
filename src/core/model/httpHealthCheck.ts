import { IEquatable } from "./iequatable";

export class HttpHealthCheck implements IEquatable<HttpHealthCheck>{

    public name!: string;
    public url!: string;
    public headers: { [key: string]: string } = {};
    public interval!: number;
    public timeout!: number;

    equals(other: HttpHealthCheck): boolean {
        if (!other) {
            return false;
        }

        if (other === this) {
            return true;
        }
        return other.url === this.url;
    }

    public toDto(): any {
        return {
            name: this.name,
            url: this.url,
            interval: this.interval,
            timeout: this.timeout,
            headers: this.headers
        }
    }

    public fromDto(dto: any) {
        this.name = dto.name;
        this.url = dto.url;
        this.interval = dto.interval;
        this.timeout = dto.timeout;
        this.headers = dto.headers;
    }
}