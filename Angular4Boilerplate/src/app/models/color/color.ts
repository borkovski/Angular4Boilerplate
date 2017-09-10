export interface IColor {
    r: number;
    g: number;
    b: number;
    a: number;
    toHex(): string;
    toRGBA(): string;
    fromRange(actual, min, max);
    clone(): IColor;
}

export class Color implements IColor {
    r: number;
    g: number;
    b: number;
    a: number;

    constructor(r, g, b, a = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    fromRange(actual, min = 0, max = 100) {
        var ratio = (actual - min) / (max - min);
        this.b = (.5 - Math.min(.5, Math.max(.25, ratio))) / .25 * 255;
        this.r = (Math.min(.75, Math.max(.5, ratio)) - .5) / .25 * 255;
        this.g = ratio >= .5 ? (1 - Math.min(1, Math.max(.75, ratio))) / .25 * 255 : (Math.min(.25, ratio)) / .25 * 255;
        this.a = 255;
        //console.log('actual: ' + actual + '; min: ' + min + '; max: ' + max + '; ratio: ' + ratio + '; r: ' + this.r + '; g: ' + this.g + '; b: ' + this.b);
    }

    toHex() { return "#" + this.toHexSingle(this.r) + this.toHexSingle(this.g) + this.toHexSingle(this.b) }

    private toHexSingle(n) {
        n = parseInt(n, 10);
        if (isNaN(n)) return "00";
        n = Math.max(0, Math.min(n, 255));
        return "0123456789ABCDEF".charAt((n - n % 16) / 16)
            + "0123456789ABCDEF".charAt(n % 16);
    }

    toRGBA() {
        return "rgba(" + Math.floor(this.r) + "," + Math.floor(this.g) + "," + Math.floor(this.b) + "," + this.a.toFixed(2) + ")";
    }

    clone() {
        return new Color(this.r, this.g, this.b, this.a);
    }
}