import { IOperationOrSignal } from '../Interfaces/IOperationOrSignal.js';
import { BaseOperationOrSignal } from './BaseOperationOrSignal.js';

export class Distributor extends BaseOperationOrSignal {
    constructor(...operationOrSignals: IOperationOrSignal[]) {
        super(...operationOrSignals);
    }

    createContactAndFillCardinality(parent: IOperationOrSignal): number {
        let c = 0;
        this.operationId = parent.operationId;
        for (const op of this.children) {
            c += op.createContactAndFillCardinality(this);
        }
        this.cardinality = c;
        return this.cardinality;
    }
}
