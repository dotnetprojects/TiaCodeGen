import { IOperationOrSignal } from '../../../Interfaces/IOperationOrSignal.js';
import { IOperationOrSignalDirectionWrapper } from '../../../Interfaces/IOperationOrSignalDirectionWrapper.js';
import { Direction } from '../../../Enums/Direction.js';
import { ArithmeticCall, ArithmeticCallOptions } from './ArithmeticCall.js';

export interface VariableArithmeticCallOptions extends ArithmeticCallOptions {}

export abstract class VariableArithmeticCall extends ArithmeticCall {
    constructor(options: VariableArithmeticCallOptions) {
        super(options);
    }

    protected addVariableInputs(options: object, startIndex: number, endIndex: number): void {
        for (let i = startIndex; i <= endIndex; i++) {
            const value = ((options as Record<string, unknown>)[`in${i}`] as IOperationOrSignal | null | undefined) ?? null;
            this.iface[`IN${i}`] = new IOperationOrSignalDirectionWrapper(value, Direction.Input);
        }
    }
}
