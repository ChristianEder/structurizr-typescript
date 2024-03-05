import { it } from "mocha";
import { expect } from "chai";
import { Workspace } from "../src";

export const delivers = () => {
    it("should add relationship", () => {
        const workspace = new Workspace("Monkey Factory - Test", "Description");

        const factory = workspace.model.addSoftwareSystem("Monkey Factory", "Oversees the production of stuffed monkey animals")!;
        const factoryWorker = workspace.model.addPerson("Monkey Factory floor worker", "Works in the production line")!;
        const relation = factory.delivers(factoryWorker, "Production problem alerts");

        expect(relation).not.to.be.null;
        expect(relation?.description).to.equal("Production problem alerts");
    });

    it("should fail for Person", () => {
        const workspace = new Workspace("Monkey Factory - Test", "Description");

        const factoryWorker = workspace.model.addPerson("Monkey Factory floor worker", "Works in the production line")!;
        const systemAdmin = workspace.model.addPerson("Monkey Factory admin", "Administrates the solution")!;
        
        expect(() => factoryWorker.delivers(systemAdmin, "Support requests")).to.throw("Person cannot be the source of 'delivers' relations");
    });
}