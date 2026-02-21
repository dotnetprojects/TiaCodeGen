"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringBuilder = void 0;
class StringBuilder {
    constructor() {
        this.parts = [];
    }
    append(text) {
        this.parts.push(text);
        return this;
    }
    appendLine(text = '') {
        this.parts.push(text + '\r\n');
        return this;
    }
    toString() {
        return this.parts.join('');
    }
    get length() {
        return this.parts.join('').length;
    }
}
exports.StringBuilder = StringBuilder;
//# sourceMappingURL=StringBuilder.js.map