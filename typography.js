const Color = require('./colors')

class Typography {
    constructor(data) {
        this.name = data.name;
        this.color = new Color(data)
        this.font = data.style
    }

    get nameArray() {
        return this.name.split(' - ')
    }

    get mediaSize() {
        return this.nameArray[0].toLowerCase()
    }

    get htmlTagName() {
        return this.nameArray[1].toLowerCase()
    }

    get className() {
        return this.nameArray[2].toLowerCase()
    }
}

module.exports = Typography;