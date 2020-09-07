import * as fs from 'fs'
import { Workspace, PlantUMLWriter } from "structurizr-typescript"

export const exportPlantUML = (location: string, workspace: Workspace) => {
    const plantUML = new PlantUMLWriter().toPlantUML(workspace);
    fs.writeFileSync(location, plantUML);
};