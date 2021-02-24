import { Relationship, Element, AbstractImpliedRelationshipsStrategy } from '..';

export class CreateImpliedRelationshipsUnlessSameRelationshipExistsStrategy extends AbstractImpliedRelationshipsStrategy {

    createImpliedRelationships(relationship: Relationship): void {
        let source: Element | null = relationship.source;
        let destination: Element | null = relationship.destination;

        const model = source.model;

        while (source) {
            while (destination) {
                if (this.impliedRelationshipIsAllowed(source, destination)) {
                    const createRelationship = !source.relationships.getEfferentRelationshipWith(destination, relationship.description);

                    if (createRelationship) {
                        const newRelationship = model.addRelationship(source, destination, relationship.description, relationship.technology, relationship.interactionStlye, false)!;
                        relationship.tags.asArray().forEach(t => newRelationship.tags.add(t));
                    }
                }

                destination = destination.parent;
            }

            destination = relationship.destination;
            source = source.parent;
        }
    }
}