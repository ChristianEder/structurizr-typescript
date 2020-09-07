import {
    Workspace,
    Location,
    InteractionStyle,
} from 'structurizr-typescript';

export const workspace = new Workspace("some workspace name", "some description");
workspace.name = 'Monkey Factory';

const user = workspace.model.addPerson('User', 'uses the system')!;

const admin = workspace.model.addPerson('Admin', 'administers the system and manages user')!;

admin!.interactsWith(user!, 'manages rights');

const factory = workspace.model.addSoftwareSystem(
    'Monkey Factory',
    'Oversees the production of stuffed monkey animals'
)!;
factory.location = Location.Internal;

const ingress = factory.addContainer('ingress', 'accepts incoming telemetry data', 'IoT Hub')!;
const storage = factory.addContainer('storage', 'stores telemetry data', 'Table Storage')!;
const frontend = factory.addContainer('frontend', 'visualizes telemetry data', 'React')!;
ingress.uses(storage, 'store telemetry', 'IoT Hub routing');
frontend.uses(storage, 'load telemetry data', 'Table Storage SDK');

const crm = workspace.model.addSoftwareSystem('CRM system', 'manage tickets')!;
crm.location = Location.External;
factory.uses(crm, 'Create tickets', 'AMQP', InteractionStyle.Asynchronous);

user.uses(factory, 'view dashboards');
admin.uses(factory, 'configure users');
admin.uses(crm, 'work on tickets');

const systemContext = workspace.views.createSystemContextView(
    factory,
    'factory-context',
    'The system context view for the monkey factory'
);
systemContext.addNearestNeighbours(factory);

const containerView = workspace.views.createContainerView(
    factory,
    'factory-containers',
    'Container view for the monkey factory'
);
containerView.addAllContainers();
containerView.addNearestNeighbours(factory);