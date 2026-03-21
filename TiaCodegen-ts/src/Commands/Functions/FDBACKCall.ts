import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal.js';
import { IOperationOrSignalDirectionWrapper } from '../../Interfaces/IOperationOrSignalDirectionWrapper.js';
import { Direction } from '../../Enums/Direction.js';
import { SystemFunctionBlockCall } from './Base/SystemFunctionBlockCall.js';

export interface FDBACKCallOptions {
    instanceName: string;
    on?: IOperationOrSignal | null;
    feedback?: IOperationOrSignal | null;
    qbad_fio?: IOperationOrSignal | null;
    ack_nec?: IOperationOrSignal | null;
    ack?: IOperationOrSignal | null;
    fdb_time?: IOperationOrSignal | null;
    q?: IOperationOrSignal | null;
    error?: IOperationOrSignal | null;
    ack_req?: IOperationOrSignal | null;
    diag?: IOperationOrSignal | null;
}

export class FDBACKCall extends SystemFunctionBlockCall {
    constructor(options: FDBACKCallOptions) {
        const {
            instanceName,
            on = null,
            feedback = null,
            qbad_fio = null,
            ack_nec = null,
            ack = null,
            fdb_time = null,
            q = null,
            error = null,
            ack_req = null,
            diag = null,
        } = options;
        super({ functionName: 'FDBACK', instanceName });
        this.iface['ON'] = new IOperationOrSignalDirectionWrapper(on, Direction.Input);
        this.iface['FEEDBACK'] = new IOperationOrSignalDirectionWrapper(feedback, Direction.Input);
        this.iface['QBAD_FIO'] = new IOperationOrSignalDirectionWrapper(qbad_fio, Direction.Input);
        this.iface['ACK_NEC'] = new IOperationOrSignalDirectionWrapper(ack_nec, Direction.Input);
        this.iface['ACK'] = new IOperationOrSignalDirectionWrapper(ack, Direction.Input);
        this.iface['FDB_TIME'] = new IOperationOrSignalDirectionWrapper(fdb_time, Direction.Input);
        this.iface['Q'] = new IOperationOrSignalDirectionWrapper(q, Direction.Output);
        this.iface['ERROR'] = new IOperationOrSignalDirectionWrapper(error, Direction.Output);
        this.iface['ACK_REQ'] = new IOperationOrSignalDirectionWrapper(ack_req, Direction.Output);
        this.iface['DIAG'] = new IOperationOrSignalDirectionWrapper(diag, Direction.Output);

        this.additionalSafetyTemplateValues = `      <TemplateValue Name="f_user_card" Type="Cardinality">1</TemplateValue>
      <TemplateValue Name="f_image_card" Type="Cardinality">0</TemplateValue>`;

        for (const w of Object.values(this.iface)) {
            if (w.operationOrSignal !== null) this.children.push(w.operationOrSignal);
        }
    }
}
