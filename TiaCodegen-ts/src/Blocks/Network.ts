import { IOperationOrSignal } from '../Interfaces/IOperationOrSignal';
import { BaseOperationOrSignal } from '../Commands/BaseOperationOrSignal';

export class Network extends BaseOperationOrSignal {
    networkTitle: string | undefined;
    description: string | undefined;
    networkTitleEnglish: string | undefined;
    descriptionEnglish: string | undefined;

    constructor(
        networkTitleOrOp?: string | IOperationOrSignal,
        networkTitleEnglishOrOp?: string | IOperationOrSignal,
        ...operationOrSignals: IOperationOrSignal[]
    ) {
        super();
        if (typeof networkTitleOrOp === 'string') {
            this.networkTitle = networkTitleOrOp;
            this.networkTitleEnglish = typeof networkTitleEnglishOrOp === 'string'
                ? networkTitleEnglishOrOp
                : undefined;
            if (networkTitleEnglishOrOp !== undefined && typeof networkTitleEnglishOrOp !== 'string') {
                this.children.push(networkTitleEnglishOrOp);
            }
            for (const op of operationOrSignals) {
                this.children.push(op);
            }
        } else {
            if (networkTitleOrOp !== undefined) this.children.push(networkTitleOrOp);
            if (networkTitleEnglishOrOp !== undefined && typeof networkTitleEnglishOrOp !== 'string') {
                this.children.push(networkTitleEnglishOrOp);
            }
            for (const op of operationOrSignals) {
                this.children.push(op);
            }
        }
    }
}
