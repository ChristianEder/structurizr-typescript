import { Element, isChildOf, Relationship, IImpliedRelationshipsStrategy } from "..";

export abstract class AbstractImpliedRelationshipsStrategy implements IImpliedRelationshipsStrategy
{
    protected impliedRelationshipIsAllowed(source: Element, destination: Element): boolean
    {
        if (source.equals(destination))
        {
            return false;
        }

        return !(isChildOf(source, destination) || isChildOf(destination, source));
    }


    abstract createImpliedRelationships(relationship: Relationship) : void;
}