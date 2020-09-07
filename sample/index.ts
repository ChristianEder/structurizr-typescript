import {
  Workspace,
  Location,
  InteractionStyle,
  StructurizrClient,
  PlantUMLWriter,
} from 'structurizr-typescript'
import * as fs from 'fs'

const buildWorkspace = () => {
  const workspace = new Workspace()
  workspace.name = 'Monkey Factory'

  const user = workspace.model.addPerson('User', 'uses the system')!

  const admin = workspace.model.addPerson('Admin', 'administers the system and manages user')!

  admin!.interactsWith(user!, 'manages rights')

  const factory = workspace.model.addSoftwareSystem(
    'Monkey Factory',
    'Oversees the production of stuffed monkey animals'
  )!
  factory.location = Location.Internal

  const ingress = factory.addContainer('ingress', 'accepts incoming telemetry data', 'IoT Hub')!
  const storage = factory.addContainer('storage', 'stores telemetry data', 'Table Storage')!
  const frontend = factory.addContainer('frontend', 'visualizes telemetry data', 'React')!
  ingress.uses(storage, 'store telemetry', 'IoT Hub routing')
  frontend.uses(storage, 'load telemetry data', 'Table Storage SDK')

  const crm = workspace.model.addSoftwareSystem('CRM system', 'manage tickets')!
  crm.location = Location.External
  factory.uses(crm, 'Create tickets', 'AMQP', InteractionStyle.Asynchronous)

  user.uses(factory, 'view dashboards')
  admin.uses(factory, 'configure users')
  admin.uses(crm, 'work on tickets')

  const systemContext = workspace.views.createSystemContextView(
    factory,
    'factory-context',
    'The system context view for the monkey factory'
  )
  systemContext.addNearestNeighbours(factory)

  const containerView = workspace.views.createContainerView(
    factory,
    'factory-containers',
    'Container view for the monkey factory'
  )
  containerView.addAllContainers()
  containerView.addNearestNeighbours(factory)

  return workspace
}

const pushWorkspace = (workspace) => {
  if (!process.env.WORKSPACE_ID) {
    return console.error('Please define WORKSPACE_ID in order to push your workspace')
  }

  if (!process.env.API_KEY || !process.env.API_SECRET) {
    return console.error('Please define API_KEY and API_SECRET in order to push your workspace')
  }

  const workspaceId = parseInt(process.env.WORKSPACE_ID)

  const client = new StructurizrClient(process.env.API_KEY, process.env.API_SECRET)

  return client.putWorkspace(workspaceId, workspace)
}

const renderUML = (location, workspace) => {
  const plantUML = new PlantUMLWriter().toPlantUML(workspace)
  fs.writeFileSync(location, plantUML)
}

const main = async () => {
  const workspace = buildWorkspace()

  // Now either write the workspace to the Structurizr backend...
  const response = await pushWorkspace(workspace)
  if (response) {
    console.log('> workspace pushed to backend', response)
  }

  // ... or render it as PlantUML
  const location = 'plant.puml'
  renderUML(location, workspace)
  console.log('> workspace rendered as UML at', location)
}

main().catch((e) => console.error('error', e))
