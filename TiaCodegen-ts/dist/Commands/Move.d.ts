import { IOperationOrSignal } from '../Interfaces/IOperationOrSignal';
import { IFunctionOperation } from '../Interfaces/IFunctionOperation';
import { BaseOperationOrSignal } from './BaseOperationOrSignal';
export declare class Move extends BaseOperationOrSignal implements IFunctionOperation {
    constructor(...operationOrSignals: IOperationOrSignal[]);
    get cardinality(): number;
    set cardinality(_value: number);
}
//# sourceMappingURL=Move.d.ts.map