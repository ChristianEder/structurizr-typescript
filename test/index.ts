import { describe, it } from "mocha";
import { use } from 'chai';
import { testApiCompatitbility, testApiIdempotency } from "./api-compatibility";
import { testPlantUMLWriter, testPlantUMLWriterIsAbleToHandleProperlyPackageNameWithMultipleWords } from "./plantUMLWriter";
import { testElementStyleThemeExport, testFullThemeExport } from "./themeExport";
import { default as deepEqualInAnyOrder } from 'deep-equal-in-any-order';
import { regression } from "./regression";
import { implicitRelationships } from "./implicitRelationships";
import { delivers } from "./delivers";
use(deepEqualInAnyOrder);


describe("structurizr-typescript", () => {

    describe("api", () => {
        it("should be compatible to the server side API", testApiCompatitbility).timeout(15000);
        it("merging unchanged workspaces should be idempotent", testApiIdempotency).timeout(30000);
    });

    describe("client", () => {
        describe("plantUML", () => {
            it("export plant UML diagrams correctly", testPlantUMLWriter);
            it(
                "handles long system names properly when exporting as package in container view",
                testPlantUMLWriterIsAbleToHandleProperlyPackageNameWithMultipleWords
            );
        })
    });

    describe("core", () => {
        describe("theme export", () => {
            it("should not export undefined fields", testElementStyleThemeExport);
            it("should export element and relationship styles", testFullThemeExport);
        });
    });

    describe("regression", regression);

    describe("implicitRelationships", implicitRelationships);

    describe("delivers", delivers);
});