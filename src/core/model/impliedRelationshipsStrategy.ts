import { Relationship } from "..";

export interface IImpliedRelationshipsStrategy {
    createImpliedRelationships(relationship: Relationship): void;
}