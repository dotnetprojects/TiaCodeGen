"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseOperationOrSignal = void 0;
class BaseOperationOrSignal {
    get cardinality() { return this._cardinality; }
    set cardinality(value) { this._cardinality = value; }
    constructor(...operationOrSignals) {
        this.debugInfo = null;
        this._operationId = 0;
        this.parent = null;
        this.doNotCreateContact = false;
        this._cardinality = 0;
        this.children = [];
        if (operationOrSignals) {
            this.children.push(...operationOrSignals);
        }
    }
    get operationId() { return this._operationId; }
    set operationId(value) { this._operationId = value; }
    createContactAndFillCardinality(parent) {
        this.cardinality = 1;
        if (this.children.length > 0 && this.children[this.children.length - 1] instanceof Or_1.Or) {
            this.cardinality = this.children[this.children.length - 1].createContactAndFillCardinality(parent);
            this.children[this.children.length - 1].doNotCreateContact = true;
        }
        return this.cardinality;
    }
    add(...operationOrSignals) {
        this.children.push(...operationOrSignals);
    }
    toString() {
        if (this instanceof And_1.And || this instanceof Or_1.Or) {
            return `${this.constructor.name} (${this.children.map(x => x.toString()).join(',')})`;
        }
        return this.constructor.name;
    }
    getFirstChildNotAnd() {
        if (this instanceof And_1.And) {
            const ch1 = this.children[0];
            if (ch1 instanceof BaseOperationOrSignal) {
                return ch1.getFirstChildNotAnd();
            }
        }
        return this;
    }
    clone() {
        // Subclasses that need cloning should override this.
        // Generic approach: create a new instance of the same class.
        const inst = new this.constructor();
        inst.debugInfo = this.debugInfo;
        inst.doNotCreateContact = this.doNotCreateContact;
        for (const c of this.children) {
            inst.children.push(c.clone());
        }
        return inst;
    }
}
exports.BaseOperationOrSignal = BaseOperationOrSignal;
// Forward declarations to avoid circular imports - these are resolved at runtime
const And_1 = require("./And");
const Or_1 = require("./Or");
//# sourceMappingURL=BaseOperationOrSignal.js.map