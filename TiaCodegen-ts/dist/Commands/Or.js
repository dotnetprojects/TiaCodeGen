"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Or = void 0;
const BaseOperationOrSignal_1 = require("./BaseOperationOrSignal");
class Or extends BaseOperationOrSignal_1.BaseOperationOrSignal {
    constructor(...operationOrSignals) {
        super(...operationOrSignals);
    }
    createContactAndFillCardinality(parent) {
        let c = 0;
        this.operationId = parent.operationId;
        for (const op of this.children) {
            c += op.createContactAndFillCardinality(this);
        }
        this.cardinality = c;
        return this.cardinality;
    }
}
exports.Or = Or;
//# sourceMappingURL=Or.js.map