import { IOperationOrSignal } from '../Interfaces/IOperationOrSignal';
import { IFunctionOperation } from '../Interfaces/IFunctionOperation';
import { BaseOperationOrSignal } from './BaseOperationOrSignal';

export class Move extends BaseOperationOrSignal implements IFunctionOperation {
    constructor(...operationOrSignals: IOperationOrSignal[]) {
        super(...operationOrSignals);
    }

    get cardinality(): number {
        return this.children.length - 1;
    }
    set cardinality(_value: number) {
        // readonly via getter, ignore sets
    }
}
