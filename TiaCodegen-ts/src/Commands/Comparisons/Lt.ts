import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal';
import { CompareOperator } from './CompareOperator';

export class Lt extends CompareOperator {
    constructor(...operationOrSignals: IOperationOrSignal[]) {
        super(...operationOrSignals);
    }
}
