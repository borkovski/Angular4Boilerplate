﻿import { Injectable } from '@angular/core';

@Injectable()
export class NoiseService {
    private permutation = [
        151, 160, 137, 91, 90, 15,
        131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
        190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
        88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
        77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
        102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
        135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
        5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
        223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
        129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
        251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
        49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
        138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
    ];

    private p: number[] = [];
    private repeat: number = 0;

    constructor() {
        for (var x = 0; x < 512; x++) {
            this.p[x] = this.permutation[x % 256];
        }
    }

    getPerlin(x: number, y: number, z: number): number {
        if (this.repeat > 0) {
            x %= this.repeat;
            y %= this.repeat;
            z %= this.repeat;
        }

        var xi = Math.floor(x) & 255;
        var yi = Math.floor(y) & 255;
        var zi = Math.floor(z) & 255;

        var xf = x - Math.floor(x);
        var yf = y - Math.floor(y);
        var zf = z - Math.floor(z);

        var u = this.fade(xf);
        var v = this.fade(yf);
        var w = this.fade(zf);

        var aaa, aba, aab, abb, baa, bba, bab, bbb;
        aaa = this.p[this.p[this.p[xi] + yi] + zi];
        aba = this.p[this.p[this.p[xi] + this.inc(yi)] + zi];
        aab = this.p[this.p[this.p[xi] + yi] + this.inc(zi)];
        abb = this.p[this.p[this.p[xi] + this.inc(yi)] + this.inc(zi)];
        baa = this.p[this.p[this.p[this.inc(xi)] + yi] + zi];
        bba = this.p[this.p[this.p[this.inc(xi)] + this.inc(yi)] + zi];
        bab = this.p[this.p[this.p[this.inc(xi)] + yi] + this.inc(zi)];
        bbb = this.p[this.p[this.p[this.inc(xi)] + this.inc(yi)] + this.inc(zi)];

        var x1, x2, y1, y2;
        x1 = this.lerp(this.grad(aaa, xf, yf, zf), this.grad(baa, xf - 1, yf, zf), u);
        x2 = this.lerp(this.grad(aba, xf, yf - 1, zf), this.grad(bba, xf - 1, yf - 1, zf), u);
        y1 = this.lerp(x1, x2, v);
        x1 = this.lerp(this.grad(aab, xf, yf, zf - 1), this.grad(bab, xf - 1, yf, zf - 1), u);
        x2 = this.lerp(this.grad(abb, xf, yf - 1, zf - 1), this.grad(bbb, xf - 1, yf - 1, zf - 1), u);
        y2 = this.lerp(x1, x2, v);

        var ret = (this.lerp(y1, y2, w) + 1) / 2;
        return ret;
    }

    private fade(t: number): number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    private grad(hash: number, x: number, y: number, z: number): number {
        var h = hash & 15;
        var u = h < 8 ? x : y;
        var v = h < 4 ? y : h == 12 || h == 14 ? x : z;
        return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
    }

    private inc(num: number): number {
        num++;
        if (this.repeat > 0) {
            num %= this.repeat;
        }
        return num;
    }

    private lerp(a: number, b: number, x: number): number {
        return a + x * (b - a);
    }
}