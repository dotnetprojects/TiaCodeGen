import { IOperationOrSignal } from '../../../Interfaces/IOperationOrSignal.js';
import { ArithmeticCall } from './ArithmeticCall.js';

export abstract class VariableArithmeticCall extends ArithmeticCall {
    constructor(functionName: string, eno: IOperationOrSignal | null = null) {
        super(functionName, eno);
    }
}
