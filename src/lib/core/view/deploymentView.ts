import { View } from "./view";
import { Model } from "../model/model";
import { DeploymentNode } from "../model/deploymentNode";

export class DeploymentView extends View {

    private _model!: Model;
    
    public get model(): Model {
        return this._model;
    }
    public set model(m: Model) {
        this._model = m;
    }

    public environment?: string;

    public toDto(): any {
        var dto = super.toDto();
        dto.environment = this.environment;
        return dto;
    }

    public fromDto(dto:any){
        super.fromDto(dto);
        this.environment = dto.environment;
    }

    public get name(): string {
        return this.softwareSystem ? this.softwareSystem.name + " - Deployment" : "Deployment";
    }

    public addAllDeploymentNodes() {
        this.model.deploymentNodes.forEach(n => this.addDeploymentNode(n));
    }

    public addDeploymentNode(deploymentNode: DeploymentNode) {
        if (deploymentNode && this.addContainerInstancesAndDeploymentNodes(deploymentNode)) {
            var parent = deploymentNode.parent;
            while (parent != null) {
                this.addElement(parent, false);
                parent = parent.parent;
            }
        }
    }

    private addContainerInstancesAndDeploymentNodes(deploymentNode: DeploymentNode): boolean {
        var hasContainers = false;

        deploymentNode.containerInstances.forEach(containerInstance => {
            if (!this.softwareSystem || containerInstance.container!.parent!.equals(this.softwareSystem)) {
                this.addElement(containerInstance, true);
                hasContainers = true;
            }
        });

        deploymentNode.children.forEach(child => {
            if (this.addContainerInstancesAndDeploymentNodes(child)) {
                hasContainers = true;
            }
        });

        if (hasContainers) {
            this.addElement(deploymentNode, false);
        }

        return hasContainers;
    }
}