import { IOperationOrSignal } from '../Interfaces/IOperationOrSignal.js';
import { IFunctionOperation } from '../Interfaces/IFunctionOperation.js';
import { BaseOperationOrSignal } from './BaseOperationOrSignal.js';

export class S_Move extends BaseOperationOrSignal implements IFunctionOperation {
    constructor(...operationOrSignals: IOperationOrSignal[]) {
        super(...operationOrSignals);
    }

    get cardinality(): number {
        return 1;
    }
    set cardinality(_value: number) {
        // readonly, ignore
    }
}
