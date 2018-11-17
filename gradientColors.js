const Color = require('./colors');

class GradientColor extends Color {
    constructor(data) {
        super(data)
        this.rgba = {
            r: super.rgbToInt(data.color.r),
            g: super.rgbToInt(data.color.g),
            b: super.rgbToInt(data.color.b),
            a: parseFloat(data.color.a.toFixed(2))
        }
    }
}

module.exports = GradientColor;