import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal';
import { Signal } from '../Signals/Signal';
import { BaseCoil } from './BaseCoil';
export declare class BaseNPCoil extends BaseCoil {
    helpSignal: Signal | null;
    constructor(signal: Signal, helpSignal: Signal | null, op?: IOperationOrSignal | null);
}
//# sourceMappingURL=BaseNPCoil.d.ts.map