"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCoil = void 0;
class BaseCoil {
    constructor(signal, op = null) {
        this.debugInfo = null;
        this.negated = false;
        this.operationId = 0;
        this.parent = null;
        this.doNotCreateContact = false;
        this.cardinality = 0;
        this.signal = signal;
        this.children = [];
        this.children.push(signal);
        if (op !== null) {
            this.children.push(op);
        }
    }
    createContactAndFillCardinality(_parent) {
        this.cardinality = 1;
        return 1;
    }
    toString() {
        return this.constructor.name;
    }
    clone() {
        const inst = new this.constructor(this.signal.clone());
        inst.debugInfo = this.debugInfo;
        inst.negated = this.negated;
        for (const c of this.children.slice(1)) {
            inst.children.push(c.clone());
        }
        return inst;
    }
}
exports.BaseCoil = BaseCoil;
//# sourceMappingURL=BaseCoil.js.map