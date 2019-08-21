
import { describe, it } from "mocha";
import { testApiCompatitbility } from "./api-compatibility";
import { testPlantUMLWriter } from "./plantUMLWriter";

describe("structurizr-typescript", () => {

    describe("api", () => {
        it("should be compatible to the server side API", testApiCompatitbility).timeout(15000);
    });

    describe("client", () => {
        describe("plantUML", () => {
            it("export plant UML diagrams correctly", testPlantUMLWriter);
        })
    });
});