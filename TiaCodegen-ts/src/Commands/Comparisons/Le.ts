import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal';
import { CompareOperator } from './CompareOperator';

export class Le extends CompareOperator {
    constructor(...operationOrSignals: IOperationOrSignal[]) {
        super(...operationOrSignals);
    }
}
