import { IOperationOrSignal } from '../Interfaces/IOperationOrSignal';
import { BaseOperationOrSignal } from '../Commands/BaseOperationOrSignal';
export declare class Network extends BaseOperationOrSignal {
    networkTitle: string | undefined;
    description: string | undefined;
    networkTitleEnglish: string | undefined;
    descriptionEnglish: string | undefined;
    constructor(networkTitleOrOp?: string | IOperationOrSignal, networkTitleEnglishOrOp?: string | IOperationOrSignal, ...operationOrSignals: IOperationOrSignal[]);
}
//# sourceMappingURL=Network.d.ts.map