"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Not = void 0;
class Not {
    constructor(signal) {
        this.debugInfo = null;
        this.operationId = 0;
        this.doNotCreateContact = false;
        this.cardinality = 0;
        this.parent = null;
        this.children = [];
        this.children.push(signal);
    }
    createContactAndFillCardinality(_parent) {
        this.cardinality = 1;
        return this.cardinality;
    }
    clone() {
        return new Not(this.children[0].clone());
    }
    toString() {
        return this.constructor.name;
    }
}
exports.Not = Not;
//# sourceMappingURL=Not.js.map