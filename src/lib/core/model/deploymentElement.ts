import { Element } from "./element";

export abstract class DeploymentElement extends Element {
    static DefaultDeploymentEnvironment = "Default";
    public environment: string = "Default";
}