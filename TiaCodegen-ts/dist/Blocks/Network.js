"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Network = void 0;
const BaseOperationOrSignal_1 = require("../Commands/BaseOperationOrSignal");
class Network extends BaseOperationOrSignal_1.BaseOperationOrSignal {
    constructor(networkTitleOrOp, networkTitleEnglishOrOp, ...operationOrSignals) {
        super();
        if (typeof networkTitleOrOp === 'string') {
            this.networkTitle = networkTitleOrOp;
            this.networkTitleEnglish = typeof networkTitleEnglishOrOp === 'string'
                ? networkTitleEnglishOrOp
                : undefined;
            if (networkTitleEnglishOrOp !== undefined && typeof networkTitleEnglishOrOp !== 'string') {
                this.children.push(networkTitleEnglishOrOp);
            }
            for (const op of operationOrSignals) {
                this.children.push(op);
            }
        }
        else {
            if (networkTitleOrOp !== undefined)
                this.children.push(networkTitleOrOp);
            if (networkTitleEnglishOrOp !== undefined && typeof networkTitleEnglishOrOp !== 'string') {
                this.children.push(networkTitleEnglishOrOp);
            }
            for (const op of operationOrSignals) {
                this.children.push(op);
            }
        }
    }
}
exports.Network = Network;
//# sourceMappingURL=Network.js.map