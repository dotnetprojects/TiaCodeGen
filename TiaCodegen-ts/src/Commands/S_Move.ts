import { IOperationOrSignal } from '../Interfaces/IOperationOrSignal';
import { IFunctionOperation } from '../Interfaces/IFunctionOperation';
import { BaseOperationOrSignal } from './BaseOperationOrSignal';

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
