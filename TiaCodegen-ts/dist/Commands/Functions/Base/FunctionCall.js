"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionCall = void 0;
const IOperationOrSignalDirectionWrapper_1 = require("../../../Interfaces/IOperationOrSignalDirectionWrapper");
const Direction_1 = require("../../../Enums/Direction");
class FunctionCall {
    constructor(functionName, eno = null) {
        this.safetyTemplateString = null;
        this.debugInfo = null;
        this.disableEno = false;
        this.version = null;
        this.additionalInnerXml = null;
        this.additionalSafetyTemplateValues = null;
        this.operationId = 0;
        this.parent = null;
        this.doNotCreateContact = false;
        this.cardinality = 0;
        this.hasNoEn = false;
        this.functionName = functionName;
        this.iface = {};
        this.children = [];
        this.eno = eno;
        if (eno !== null) {
            this.iface['eno'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(eno, Direction_1.Direction.Eno);
        }
    }
    createContactAndFillCardinality(_parent) {
        this.cardinality = 1;
        return this.cardinality;
    }
    toString() {
        return `${this.constructor.name}(${this.functionName})`;
    }
    clone() {
        throw new Error('Not yet supported');
    }
}
exports.FunctionCall = FunctionCall;
//# sourceMappingURL=FunctionCall.js.map