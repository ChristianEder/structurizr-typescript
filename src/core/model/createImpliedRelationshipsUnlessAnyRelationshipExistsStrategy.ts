import { Relationship, Element, AbstractImpliedRelationshipsStrategy } from '..';

export class CreateImpliedRelationshipsUnlessAnyRelationshipExistsStrategy extends AbstractImpliedRelationshipsStrategy {

    createImpliedRelationships(relationship: Relationship): void {
        let source: Element | null = relationship.source;
        let destination: Element | null = relationship.destination;

        const model = source.model;

        while (source) {
            while (destination) {
                if (this.impliedRelationshipIsAllowed(source, destination)) {
                    const createRelationship = !source.relationships.getEfferentRelationshipWith(destination);

                    if (createRelationship) {
                        const newRelationship = model.addRelationship(source, destination, relationship.description, relationship.technology, relationship.interactionStlye, false)!;
                        if(newRelationship){
                            newRelationship.linkedRelationshipId = relationship.id;
                        }
                    }
                }

                destination = destination.parent;
            }

            destination = relationship.destination;
            source = source.parent;
        }
    }
}