import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal';
import { SystemFunctionBlockCall } from './Base/SystemFunctionBlockCall';
export declare class FDBACKCall extends SystemFunctionBlockCall {
    constructor(instanceName: string, on?: IOperationOrSignal | null, feedback?: IOperationOrSignal | null, qbad_fio?: IOperationOrSignal | null, ack_nec?: IOperationOrSignal | null, ack?: IOperationOrSignal | null, fdb_time?: IOperationOrSignal | null, q?: IOperationOrSignal | null, error?: IOperationOrSignal | null, ack_req?: IOperationOrSignal | null, diag?: IOperationOrSignal | null);
}
//# sourceMappingURL=FDBACKCall.d.ts.map