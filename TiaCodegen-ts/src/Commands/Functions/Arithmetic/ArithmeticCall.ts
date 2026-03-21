import { SystemFunctionCall, SystemFunctionCallOptions } from '../Base/SystemFunctionCall.js';

export interface ArithmeticCallOptions extends SystemFunctionCallOptions {}

export abstract class ArithmeticCall extends SystemFunctionCall {
    type: string = '';

    constructor(options: ArithmeticCallOptions) {
        super(options);
    }
}
