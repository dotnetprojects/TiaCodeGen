import { IOperationOrSignal } from '../../../Interfaces/IOperationOrSignal.js';
import { FunctionCall } from './FunctionCall.js';

export class SystemFunctionCall extends FunctionCall {
    constructor(functionName: string, eno: IOperationOrSignal | null = null) {
        super(functionName, eno);
    }
}
