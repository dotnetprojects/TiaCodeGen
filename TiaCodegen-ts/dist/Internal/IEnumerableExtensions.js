"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatten = flatten;
function flatten(e, f) {
    if (!e)
        return [];
    return e.flatMap(c => flatten(f(c), f)).concat(e);
}
//# sourceMappingURL=IEnumerableExtensions.js.map