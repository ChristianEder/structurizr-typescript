import { workspace } from './workspace';
import { pushWorkspace } from './pushWorkspace';
import { exportPlantUML } from './exportPlantUML';

const main = async () => {
  // Now either write the workspace to the Structurizr backend...
  const response = await pushWorkspace(workspace);
  if (response) {
    console.log('> workspace pushed to backend', response);
  }

  // ... or render it as PlantUML
  const location = 'plant.puml';
  exportPlantUML(location, workspace);
  console.log('> workspace rendered as PlantUML at', location);
};

main().catch((e) => console.error('error', e));
