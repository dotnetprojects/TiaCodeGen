import { FunctionCall, FunctionCallOptions } from './FunctionCall.js';

export interface SystemFunctionCallOptions extends FunctionCallOptions {}

export class SystemFunctionCall extends FunctionCall {
    constructor(options: SystemFunctionCallOptions) {
        super(options);
    }
}
