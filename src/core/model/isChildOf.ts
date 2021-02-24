import { Element, Person } from "..";

export function isChildOf(e1: Element, e2: Element): boolean {
    if (e1.type === Person.type || e2.type === Person.type) {
        return false;
    }

    let parent = e2.parent;
    while (parent) {
        if (parent.id === e1.id) {
            return true;
        }

        parent = parent.parent;
    }

    return false;
}