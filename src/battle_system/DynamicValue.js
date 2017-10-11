class DynamicValue {

    constructor(/*int */ maxValue) {

        this.maxValue = maxValue;
        this.value = maxValue;

    }

    getPercentageFull() {
        return this.value / this.maxValue;
    }

}

export {DynamicValue};