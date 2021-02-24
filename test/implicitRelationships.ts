import { it, describe } from "mocha";
import { expect } from "chai";
import { Workspace, CreateImpliedRelationshipsUnlessAnyRelationshipExistsStrategy, CreateImpliedRelationshipsUnlessSameRelationshipExistsStrategy } from "../src";

export const implicitRelationships = () => {


    describe("DefaultImpliedRelationshipsStrategy", () => {

        it("should not add any implicit relationships", () => {
            const workspace = new Workspace("Monkey Factory - Test", "Description");

            const factory = workspace.model.addSoftwareSystem("Monkey Factory", "Oversees the production of stuffed monkey animals")!;
            const crm = workspace.model.addSoftwareSystem("Monkey CRM", "Stores and manages customer data")!;
            const ingress = factory.addContainer("ingress", "accepts incoming telemetry data", "IoT Hub")!;
            ingress.uses(crm, "Get customer data", "HTTP");

            const implicitRelation = factory.relationships.getEfferentRelationshipWith(crm);
            expect(implicitRelation).to.be.null;
        });

    });

    describe("CreateImpliedRelationshipsUnlessAnyRelationshipExistsStrategy", () => {

        it("should add implicit relation if no relationship exists ", () => {
            const workspace = new Workspace("Monkey Factory - Test", "Description");
            workspace.model.impliedRelationshipsStrategy = new CreateImpliedRelationshipsUnlessAnyRelationshipExistsStrategy();

            const factory = workspace.model.addSoftwareSystem("Monkey Factory", "Oversees the production of stuffed monkey animals")!;
            const crm = workspace.model.addSoftwareSystem("Monkey CRM", "Stores and manages customer data")!;
            const ingress = factory.addContainer("ingress", "accepts incoming telemetry data", "IoT Hub")!;
            ingress.uses(crm, "Get customer data", "HTTP");

            const implicitRelation = factory.relationships.getEfferentRelationshipWith(crm);
            expect(implicitRelation).not.to.be.null;
            expect(implicitRelation.description).to.equal("Get customer data");
            expect(implicitRelation.technology).to.equal("HTTP");
        });

        it("should not add implicit relation if any relationship exists ", () => {
            const workspace = new Workspace("Monkey Factory - Test", "Description");
            workspace.model.impliedRelationshipsStrategy = new CreateImpliedRelationshipsUnlessAnyRelationshipExistsStrategy();

            const factory = workspace.model.addSoftwareSystem("Monkey Factory", "Oversees the production of stuffed monkey animals")!;
            const crm = workspace.model.addSoftwareSystem("Monkey CRM", "Stores and manages customer data")!;
            const ingress = factory.addContainer("ingress", "accepts incoming telemetry data", "IoT Hub")!;
            factory.uses(crm, "Load customer data")
            ingress.uses(crm, "Get customer data", "HTTP");

            const explicitRelation = factory.relationships.getEfferentRelationshipWith(crm, "Load customer data");
            expect(explicitRelation).not.to.be.null;
            expect(explicitRelation.description).to.equal("Load customer data");
            expect(explicitRelation.technology).to.be.undefined;
            
            const implicitRelation = factory.relationships.getEfferentRelationshipWith(crm, "Get customer data");
            expect(implicitRelation).to.be.null;
        });

    });

    describe("CreateImpliedRelationshipsUnlessSameRelationshipExistsStrategy", () => {

        it("should add implicit relation if no relationship exists ", () => {
            const workspace = new Workspace("Monkey Factory - Test", "Description");
            workspace.model.impliedRelationshipsStrategy = new CreateImpliedRelationshipsUnlessSameRelationshipExistsStrategy();

            const factory = workspace.model.addSoftwareSystem("Monkey Factory", "Oversees the production of stuffed monkey animals")!;
            const crm = workspace.model.addSoftwareSystem("Monkey CRM", "Stores and manages customer data")!;
            const ingress = factory.addContainer("ingress", "accepts incoming telemetry data", "IoT Hub")!;
            ingress.uses(crm, "Get customer data", "HTTP");

            const implicitRelation = factory.relationships.getEfferentRelationshipWith(crm);
            expect(implicitRelation).not.to.be.null;
            expect(implicitRelation.description).to.equal("Get customer data");
            expect(implicitRelation.technology).to.equal("HTTP");
        });

        it("should add implicit relation if other relationship exists ", () => {
            const workspace = new Workspace("Monkey Factory - Test", "Description");
            workspace.model.impliedRelationshipsStrategy = new CreateImpliedRelationshipsUnlessSameRelationshipExistsStrategy();

            const factory = workspace.model.addSoftwareSystem("Monkey Factory", "Oversees the production of stuffed monkey animals")!;
            const crm = workspace.model.addSoftwareSystem("Monkey CRM", "Stores and manages customer data")!;
            const ingress = factory.addContainer("ingress", "accepts incoming telemetry data", "IoT Hub")!;
            factory.uses(crm, "Load customer data")
            ingress.uses(crm, "Get customer data", "HTTP");

            const explicitRelation = factory.relationships.getEfferentRelationshipWith(crm, "Load customer data");
            expect(explicitRelation).not.to.be.null;
            expect(explicitRelation.description).to.equal("Load customer data");
            expect(explicitRelation.technology).to.be.undefined;
            
            const implicitRelation = factory.relationships.getEfferentRelationshipWith(crm, "Get customer data");
            expect(implicitRelation).not.to.be.null;
            expect(implicitRelation.description).to.equal("Get customer data");
            expect(implicitRelation.technology).to.equal("HTTP");
        });

        it("should not add implicit relation if same relationship exists ", () => {
            const workspace = new Workspace("Monkey Factory - Test", "Description");
            workspace.model.impliedRelationshipsStrategy = new CreateImpliedRelationshipsUnlessSameRelationshipExistsStrategy();

            const factory = workspace.model.addSoftwareSystem("Monkey Factory", "Oversees the production of stuffed monkey animals")!;
            const crm = workspace.model.addSoftwareSystem("Monkey CRM", "Stores and manages customer data")!;
            const ingress = factory.addContainer("ingress", "accepts incoming telemetry data", "IoT Hub")!;
            factory.uses(crm, "Get customer data")
            ingress.uses(crm, "Get customer data", "HTTP");

            const explicitRelation = factory.relationships.getEfferentRelationshipWith(crm, "Get customer data");
            expect(explicitRelation).not.to.be.null;
            expect(explicitRelation.description).to.equal("Get customer data");
            expect(explicitRelation.technology).to.be.undefined;
        });

    });
}