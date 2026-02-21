import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal';
import { CompareOperator } from './CompareOperator';

export class Ge extends CompareOperator {
    constructor(...operationOrSignals: IOperationOrSignal[]) {
        super(...operationOrSignals);
    }
}
