import { FunctionBlockCall, FunctionBlockCallOptions } from './FunctionBlockCall.js';

export interface SystemFunctionBlockCallOptions extends FunctionBlockCallOptions {}

export class SystemFunctionBlockCall extends FunctionBlockCall {
    templateValueName: string | null = null;
    templateValueType: string | null = null;
    templateValue: string | null = null;

    constructor(options: SystemFunctionBlockCallOptions) {
        super(options);
    }
}
