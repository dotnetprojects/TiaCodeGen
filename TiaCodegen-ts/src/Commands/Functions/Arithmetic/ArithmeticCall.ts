import { IOperationOrSignal } from '../../../Interfaces/IOperationOrSignal';
import { SystemFunctionCall } from '../Base/SystemFunctionCall';

export abstract class ArithmeticCall extends SystemFunctionCall {
    type: string = '';

    constructor(functionName: string, eno: IOperationOrSignal | null = null) {
        super(functionName, eno);
    }
}
