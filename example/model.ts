import { System, Container, User } from '../lib/index';

export class ArchitectureModel {

    private system: System;
    private webApp: Container;
    private database: Container;
    private user: User;

    constructor() {
        this.system = new System("Web shop");
        this.webApp = this.system.addContainer(new Container("Shop frontend", "ASP.NET Core"));
        this.database = this.system.addContainer(new Container("Shop database", "Azure SQL"));
        this.user = this.system.addUser(new User("Customer"));

        this.user.uses(this.webApp, "Buy stuff", "HTTPS");
        this.webApp.uses(this.database, "Persist and load state", "EF Core")
    }
}