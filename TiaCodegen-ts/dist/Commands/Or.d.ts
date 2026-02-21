import { IOperationOrSignal } from '../Interfaces/IOperationOrSignal';
import { BaseOperationOrSignal } from './BaseOperationOrSignal';
export declare class Or extends BaseOperationOrSignal {
    constructor(...operationOrSignals: IOperationOrSignal[]);
    createContactAndFillCardinality(parent: IOperationOrSignal): number;
}
//# sourceMappingURL=Or.d.ts.map