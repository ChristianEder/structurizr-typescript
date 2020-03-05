export enum Orientation {
    Portrait = "Portrait",
    Landscape = "Landscape"
}

export class PaperSize {

    private static paperSizes: { [key: string]: PaperSize } = {};

    public static readonly A6_Portrait = new PaperSize("A6_Portrait", "A6", Orientation.Portrait, 1240, 1748);
    public static readonly A6_Landscape = new PaperSize("A6_Landscape", "A6", Orientation.Landscape, 1748, 1240);

    public static readonly A5_Portrait = new PaperSize("A5_Portrait", "A5", Orientation.Portrait, 1748, 2480);
    public static readonly A5_Landscape = new PaperSize("A5_Landscape", "A5", Orientation.Landscape, 2480, 1748);

    public static readonly A4_Portrait = new PaperSize("A4_Portrait", "A4", Orientation.Portrait, 2480, 3508);
    public static readonly A4_Landscape = new PaperSize("A4_Landscape", "A4", Orientation.Landscape, 3508, 2480);

    public static readonly A3_Portrait = new PaperSize("A3_Portrait", "A3", Orientation.Portrait, 3508, 4961);
    public static readonly A3_Landscape = new PaperSize("A3_Landscape", "A3", Orientation.Landscape, 4961, 3508);

    public static readonly A2_Portrait = new PaperSize("A2_Portrait", "A2", Orientation.Portrait, 4961, 7016);
    public static readonly A2_Landscape = new PaperSize("A2_Landscape", "A2", Orientation.Landscape, 7016, 4961);

    public static readonly A1_Portrait = new PaperSize("A1_Portrait", "A1", Orientation.Portrait, 7016, 9933);
    public static readonly A1_Landscape = new PaperSize("A1_Landscape", "A1", Orientation.Landscape, 9933, 7016);

    public static readonly A0_Portrait = new PaperSize("A0_Portrait", "A0", Orientation.Portrait, 9933, 14043);
    public static readonly A0_Landscape = new PaperSize("A0_Landscape", "A0", Orientation.Landscape, 14043, 9933);

    public static readonly Letter_Portrait = new PaperSize("Letter_Portrait", "Letter", Orientation.Portrait, 2550, 3300);
    public static readonly Letter_Landscape = new PaperSize("Letter_Landscape", "Letter", Orientation.Landscape, 3300, 2550);

    public static readonly Legal_Portrait = new PaperSize("Legal_Portrait", "Legal", Orientation.Portrait, 2550, 4200);
    public static readonly Legal_Landscape = new PaperSize("Legal_Landscape", "Legal", Orientation.Landscape, 4200, 2550);

    public static readonly Slide_4_3 = new PaperSize("Slide_4_3", "Slide 4:3", Orientation.Landscape, 3306, 2480);
    public static readonly Slide_16_9 = new PaperSize("Slide_16_9", "Slide 16:9", Orientation.Landscape, 3508, 1973);

    private constructor(public key: string, public name: string, public orientation: Orientation, public width: number, public height: number) {
        PaperSize.paperSizes[key] = this;
    }

    public static getPaperSize(key:string){
        return this.paperSizes[key] || this.A4_Portrait;
    }
}