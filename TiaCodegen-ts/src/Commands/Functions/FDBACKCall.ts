import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal';
import { IOperationOrSignalDirectionWrapper } from '../../Interfaces/IOperationOrSignalDirectionWrapper';
import { Direction } from '../../Enums/Direction';
import { SystemFunctionBlockCall } from './Base/SystemFunctionBlockCall';

export class FDBACKCall extends SystemFunctionBlockCall {
    constructor(
        instanceName: string,
        on: IOperationOrSignal | null = null,
        feedback: IOperationOrSignal | null = null,
        qbad_fio: IOperationOrSignal | null = null,
        ack_nec: IOperationOrSignal | null = null,
        ack: IOperationOrSignal | null = null,
        fdb_time: IOperationOrSignal | null = null,
        q: IOperationOrSignal | null = null,
        error: IOperationOrSignal | null = null,
        ack_req: IOperationOrSignal | null = null,
        diag: IOperationOrSignal | null = null,
    ) {
        super('FDBACK', instanceName, null);
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
