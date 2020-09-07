import { IEquatable } from "./iequatable";
import { Role } from "./role";

export class User implements IEquatable<User> {

    public username!: string;
    public role!: Role;

    equals(other: User): boolean {
        return other?.username === this.username && other?.role === this.role;
    }

    public toDto(): any {
        return {
            username: this.username,
            role: this.role
        };
    }

    public fromDto(dto: any) {
        this.username = dto.username;
        this.role = dto.role;
    }
}