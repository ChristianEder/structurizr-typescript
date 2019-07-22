
import { describe, it } from "mocha";
import { testApiCompatitbility } from "./api-compatibility";

describe("structurizr-typescript", () => {

    describe("api", () => {
        it("should be compatible to the server side API", testApiCompatitbility);
    });

    describe("client", () => {
        describe("plantUML", () => {
            it("export plant UML diagrams correctly", () => {

            });
        })
    });
});