import { User } from "./user";
import { Role } from "./role";

export class WorkspaceConfiguration {

    private users: User[] = [];

    public addUser(username: string, role: Role): void {
        const existingUser = this.users.find(u => u.username === username)
        if (existingUser) {
            if (existingUser.role !== role) {
                throw new Error("The user " + username + " already exists, but with a different role (" + existingUser.role + ")");
            }
            return;
        }

        const user = new User();
        user.username = username;
        user.role = role;
        this.users.push(user);
    }

    public toDto(): any {
        return {
            users: this.users.map(u => u.toDto())
        };
    }

    public fromDto(dto: any) {
        if(!dto){
            return;
        }
        this.users = (dto.users as any[] ?? []).map(u => {
            const user = new User();
            user.fromDto(u);
            return user;
        });
    }
}