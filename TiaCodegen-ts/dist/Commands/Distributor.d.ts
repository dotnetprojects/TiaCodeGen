import { IOperationOrSignal } from '../Interfaces/IOperationOrSignal';
import { BaseOperationOrSignal } from './BaseOperationOrSignal';
export declare class Distributor extends BaseOperationOrSignal {
    constructor(...operationOrSignals: IOperationOrSignal[]);
    createContactAndFillCardinality(parent: IOperationOrSignal): number;
}
//# sourceMappingURL=Distributor.d.ts.map