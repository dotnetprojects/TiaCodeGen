"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeBlock = void 0;
const BaseOperationOrSignal_1 = require("../Commands/BaseOperationOrSignal");
class CodeBlock extends BaseOperationOrSignal_1.BaseOperationOrSignal {
    constructor(name = '') {
        super();
        this.safety = false;
        this.name = name;
    }
}
exports.CodeBlock = CodeBlock;
//# sourceMappingURL=CodeBlock.js.map