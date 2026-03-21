import { ArithmeticCall, ArithmeticCallOptions } from './ArithmeticCall.js';

export interface VariableArithmeticCallOptions extends ArithmeticCallOptions {}

export abstract class VariableArithmeticCall extends ArithmeticCall {
    constructor(options: VariableArithmeticCallOptions) {
        super(options);
    }
}
