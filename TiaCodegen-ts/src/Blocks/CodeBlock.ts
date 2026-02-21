import { BaseOperationOrSignal } from '../Commands/BaseOperationOrSignal';

export class CodeBlock extends BaseOperationOrSignal {
    name: string;
    safety: boolean = false;

    constructor(name: string = '') {
        super();
        this.name = name;
    }
}
