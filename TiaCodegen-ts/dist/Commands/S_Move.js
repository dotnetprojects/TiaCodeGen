"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S_Move = void 0;
const BaseOperationOrSignal_1 = require("./BaseOperationOrSignal");
class S_Move extends BaseOperationOrSignal_1.BaseOperationOrSignal {
    constructor(...operationOrSignals) {
        super(...operationOrSignals);
    }
    get cardinality() {
        return 1;
    }
    set cardinality(_value) {
        // readonly, ignore
    }
}
exports.S_Move = S_Move;
//# sourceMappingURL=S_Move.js.map