"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryGetParent = tryGetParent;
function tryGetParent(op, ctor) {
    let chk = op.parent;
    while (chk !== null && chk !== undefined) {
        if (chk instanceof ctor)
            return chk;
        chk = chk.parent;
    }
    return null;
}
//# sourceMappingURL=OperationOrSignalExtensions.js.map