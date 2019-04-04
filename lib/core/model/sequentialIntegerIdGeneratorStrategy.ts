import { Element } from "./element";
import { Relationship } from "./relationship";

export class SequentialIntegerIdGeneratorStrategy {
    private _id = 0;

    public found(id: string): void {
        var idInt = parseInt(id);
        if (idInt > this._id) {
            this._id = idInt;
        }
    }

    public generateId(item: Element | Relationship): string {
        var idString = "" + this._id;
        this._id += 1;
        return idString;
    }
}