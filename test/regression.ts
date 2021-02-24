import { it } from "mocha";
import { expect } from "chai";
import { Workspace } from "../src";

export const regression = () => {
    it("should not return null when adding relations", () => {
        const workspace = new Workspace("Monkey Factory - Test", "Description");
        const factory = workspace.model.addSoftwareSystem("Monkey Factory", "Oversees the production of stuffed monkey animals")!;
        const ingress = factory.addContainer("ingress", "accepts incoming telemetry data", "IoT Hub")!;
        const storage = factory.addContainer("storage", "stores telemetry data", "Table Storage")!;

        const relation = ingress.uses(storage, "Store telemetry", "IoT Hub Routing");

        expect(relation).not.to.be.null;
    });
}