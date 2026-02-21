import { IOperationOrSignal } from '../../../Interfaces/IOperationOrSignal';
import { ArithmeticCall } from './ArithmeticCall';

export abstract class VariableArithmeticCall extends ArithmeticCall {
    constructor(functionName: string, eno: IOperationOrSignal | null = null) {
        super(functionName, eno);
    }
}
