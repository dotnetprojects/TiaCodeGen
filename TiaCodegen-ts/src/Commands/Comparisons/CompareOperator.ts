import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal';
import { BaseOperationOrSignal } from '../BaseOperationOrSignal';

export abstract class CompareOperator extends BaseOperationOrSignal {
    constructor(...operationOrSignals: IOperationOrSignal[]) {
        super(...operationOrSignals);
    }
}
