"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseNPCoil = void 0;
const BaseCoil_1 = require("./BaseCoil");
class BaseNPCoil extends BaseCoil_1.BaseCoil {
    constructor(signal, helpSignal, op = null) {
        super(signal, op);
        this.helpSignal = helpSignal;
        if (helpSignal !== null) {
            this.children.push(helpSignal);
        }
    }
}
exports.BaseNPCoil = BaseNPCoil;
//# sourceMappingURL=BaseNPCoil.js.map