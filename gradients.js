const GradientColor = require('./gradientColors');
const Color = require('./colors');
class Gradient {
    constructor(data, colorsArray) {
        this.data = data
        this.name = data.name;
        this.gradientHandles = {
            start: data.fills[0].gradientHandlePositions[0],
            end: data.fills[0].gradientHandlePositions[1]
        };

        this.colors = data.fills[0].gradientStops;
        this.colorObjects = this.creatColorObjects(this.colors)

        this.angle = this.calculateAngle(
                this.gradientHandles.start, 
                this.gradientHandles.end
            );
    }
    get cssGradientArray() {
        return this.colorObjects.map((colorObject, index) => {
            const position = this.floatToPercent(this.colors[index].position);
            return '$' + colorObject.name + " " + position;
        })
    }
    cssGradient(reversed) {
        const cssGradientArray = this.cssGradientArray
        if(reversed) { cssGradientArray.reverse() }
        cssGradientArray.unshift(this.angle + 'deg')
        return `gradient(${cssGradientArray.join(", ")})`
    }

    get cssVariables() { 
        return `$${this.name}: ${this.cssGradient()}\n$${this.name}-reversed: ${this.cssGradient(true)}`
    }

    creatColorObjects(colors) {
        return colors.map((color, index) => {
            color.name = this.name + "-color-" + (index + 1)
            return new GradientColor(color)
        }); 
    }
    
    floatToPercent(value) {
        return (value *= 100).toFixed(0) + "%";
    }

    calculateAngle(startHandle, endHandle) {
        const radians = Math.atan(this.calculateGradient(startHandle, endHandle))
        return parseInt(this.radToDeg(radians).toFixed(1))
    }

    calculateGradient(startHandle, endHandle){
        return (endHandle.y - startHandle.y) / (endHandle.x - startHandle.x) * -1
    }

    radToDeg(radian){
        return (180 * radian) / Math.PI;
    }
} 

module.exports = Gradient; 
