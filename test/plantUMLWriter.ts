import { expect } from "chai";
import { PlantUMLWriter, Workspace, Location, SoftwareSystem } from "../src";
import { createWorkspace, createWorkspaceWithSoftwareSystemNameOfMoreThanTwoWords } from "./workspace";

export function testPlantUMLWriter() {
  const plantUML = new PlantUMLWriter().toPlantUML(createWorkspace());
  expect(plantUML).not.to.be.empty;
}

export function testPlantUMLWriterIsAbleToHandleProperlyPackageNameWithMultipleWords() {
  const workspace: Workspace = createWorkspaceWithSoftwareSystemNameOfMoreThanTwoWords();

  const expected = "@startuml\r\ntitle GPS tracking system - Containers\r\ncaption Container view for the GPS tracking system\r\npackage \"GPS tracking system\" {\r\n}\r\n@enduml";
  const result = new PlantUMLWriter().toPlantUML(workspace);

  expect(result.trim()).to.eq(expected);
}

