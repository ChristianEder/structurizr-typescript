import { Element } from "./element";
import { SoftwareSystem } from "./softwareSystem";
import { Relationship } from "./relationship";
import { InteractionStyle } from "./interactionStyle";
import { Container } from "./container";
import {Component} from "./component";

export abstract class StaticStructureElement extends Element {

    public uses(destination: SoftwareSystem | Container | Component, description: string, technology?: string, interactionStyle = InteractionStyle.Synchronous): Relationship | null {
        return this.model.addRelationship(this, destination, description, technology, interactionStyle);
    }

}
