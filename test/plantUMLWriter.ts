import { expect } from "chai";
import { PlantUMLWriter } from "../src";
import { createWorkspace } from "./workspace";

export function testPlantUMLWriter() {
    const plantUML = new PlantUMLWriter().toPlantUML(createWorkspace());
    expect(plantUML).not.to.be.empty;
}