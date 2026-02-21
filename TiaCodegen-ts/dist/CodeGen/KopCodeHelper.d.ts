import { IOperationOrSignal } from '../Interfaces/IOperationOrSignal';
import { CodeBlock } from '../Blocks/CodeBlock';
export declare class KopCodeHelper {
    static flattenOrdered<T>(e: T[], f: (t: T) => T[]): T[];
    private _currentId;
    private _block;
    private _sb;
    constructor(block: CodeBlock);
    private addSignalDefinitions;
    private checkAndAndOr;
    private printTree;
    private addContactDefinitions;
    private static readonly debug;
    private addWires;
    private addPowerrails;
    private fixChildAndsAndSingleOr;
    private escapeForXml;
    private printTreeParent;
    private setParent;
    getXml(idRef: {
        value: number;
    }): string;
    getAllOrSignals(sng: IOperationOrSignal): IOperationOrSignal[];
    private isIPartName;
    private isIFunctionOperation;
}
//# sourceMappingURL=KopCodeHelper.d.ts.map