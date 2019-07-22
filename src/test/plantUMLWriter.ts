import { expect } from "chai";
import { PlantUMLWriter } from "../lib";
import { workspace } from "./workspace";

export function testPlantUMLWriter() {
    const plantUML = new PlantUMLWriter().toPlantUML(workspace);
    expect(plantUML).not.to.be.empty;
}