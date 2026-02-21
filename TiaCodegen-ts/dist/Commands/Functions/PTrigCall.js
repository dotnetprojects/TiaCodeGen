"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PTrigCall = void 0;
const BaseNPCoil_1 = require("../Coils/BaseNPCoil");
class PTrigCall extends BaseNPCoil_1.BaseNPCoil {
    constructor(signal) {
        super(signal, null, null);
        this.partName = 'PBox';
    }
}
exports.PTrigCall = PTrigCall;
//# sourceMappingURL=PTrigCall.js.map