import { ModelItem } from "./modelItem";

export class Tags {

    public static Synchronous = "Synchronous";
    public static Asynchronous = "Asynchronous";
    public static Relationship = "Relationship";
    public static Element = "Element";
    public static Person = "Person";
    public static SoftwareSystem = "Software System";

    private _all: string[] = [];

    constructor(private _owner: ModelItem) {
    }

    public add(tag: string): void {
        this._all.push(tag);
    }

    public remove(tag: string): void {
        this._all.splice(this._all.indexOf(tag), 1);
    }

    public contains(tag: string): boolean {
        return this._all.indexOf(tag) >= 0;
    }

    public toDto(): string {
        var all = [
            ...this._all,
            ...this._owner.getRequiredTags()
        ];
        if (all.length == 0) {
            return "";
        }
        return all.join(",");
    }

    public fromDto(value: string) {
        this._all = value.split(",");
    }

}