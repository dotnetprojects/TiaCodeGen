import { IOperationOrSignal } from '../../../Interfaces/IOperationOrSignal.js';
import { SystemFunctionCall } from '../Base/SystemFunctionCall.js';

export abstract class ArithmeticCall extends SystemFunctionCall {
    type: string = '';

    constructor(functionName: string, eno: IOperationOrSignal | null = null) {
        super(functionName, eno);
    }
}
