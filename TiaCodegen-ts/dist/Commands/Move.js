"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Move = void 0;
const BaseOperationOrSignal_1 = require("./BaseOperationOrSignal");
class Move extends BaseOperationOrSignal_1.BaseOperationOrSignal {
    constructor(...operationOrSignals) {
        super(...operationOrSignals);
    }
    get cardinality() {
        return this.children.length - 1;
    }
    set cardinality(_value) {
        // readonly via getter, ignore sets
    }
}
exports.Move = Move;
//# sourceMappingURL=Move.js.map