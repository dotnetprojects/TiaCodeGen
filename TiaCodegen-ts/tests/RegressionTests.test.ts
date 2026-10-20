import * as lib from '../src/index';

type CreateSignal = (name: string, type?: lib.SignalType) => lib.Signal;

const commands: [string, (instance: string, signal: CreateSignal) => lib.IOperationOrSignal][] = [
    ['Not', (_instance, signal) => new lib.Not(signal('#Data.Negated'))],
    ['And', (instance, signal) => new lib.And(signal('#Data.A', lib.SignalType.Int), signal('#Data.B', lib.SignalType.Int))],
    ['Coil', (instance, signal) => new lib.Coil(signal("#Data.signal"), signal("#Data.op"))],
    ['PCoil', (instance, signal) => new lib.PCoil(signal("#Data.signal"), signal("#Data.helpSignal"), signal("#Data.op"))],
    ['RCoil', (instance, signal) => new lib.RCoil(signal("#Data.signal"), signal("#Data.op"))],
    ['SCoil', (instance, signal) => new lib.SCoil(signal("#Data.signal"), signal("#Data.op"))],
    ['Eq', (instance, signal) => new lib.Eq(signal('#Data.A', lib.SignalType.Int), signal('#Data.B', lib.SignalType.Int))],
    ['Ge', (instance, signal) => new lib.Ge(signal('#Data.A', lib.SignalType.Int), signal('#Data.B', lib.SignalType.Int))],
    ['Gt', (instance, signal) => new lib.Gt(signal('#Data.A', lib.SignalType.Int), signal('#Data.B', lib.SignalType.Int))],
    ['InRangeCall', (instance, signal) => new lib.InRangeCall(signal("#Data.min"), signal("#Data.in"), signal("#Data.max"), signal("#Data.out"), null)],
    ['Le', (instance, signal) => new lib.Le(signal('#Data.A', lib.SignalType.Int), signal('#Data.B', lib.SignalType.Int))],
    ['Lt', (instance, signal) => new lib.Lt(signal('#Data.A', lib.SignalType.Int), signal('#Data.B', lib.SignalType.Int))],
    ['Ne', (instance, signal) => new lib.Ne(signal('#Data.A', lib.SignalType.Int), signal('#Data.B', lib.SignalType.Int))],
    ['OutRangeCall', (instance, signal) => new lib.OutRangeCall(signal("#Data.min"), signal("#Data.in"), signal("#Data.max"), signal("#Data.out"), null)],
    ['Convert', (instance, signal) => new lib.Convert(signal('#Data.A', lib.SignalType.Int), signal('#Data.B', lib.SignalType.Int))],
    ['Distributor', (instance, signal) => new lib.Distributor(signal('#Data.A', lib.SignalType.Int), signal('#Data.B', lib.SignalType.Int))],
    ['AckGlCall', (instance, signal) => new lib.AckGlCall({ instanceName: instance, ackGlob: signal("#Data.ackGlob"), eno: new lib.And(new lib.Coil(signal("#Data.eno"))) })],
    ['AddCall', (instance, signal) => new lib.AddCall({ type: "Int", in1: signal("#Data.in1"), in2: signal("#Data.in2"), in3: signal("#Data.in3"), out1: signal("#Data.out1"), eno: new lib.And(new lib.Coil(signal("#Data.eno"))) })],
    ['DivCall', (instance, signal) => new lib.DivCall({ type: "Int", in1: signal("#Data.in1"), in2: signal("#Data.in2"), out1: signal("#Data.out1"), eno: new lib.And(new lib.Coil(signal("#Data.eno"))) })],
    ['ModCall', (instance, signal) => new lib.ModCall({ type: "Int", in1: signal("#Data.in1"), in2: signal("#Data.in2"), out1: signal("#Data.out1"), eno: new lib.And(new lib.Coil(signal("#Data.eno"))) })],
    ['MulCall', (instance, signal) => new lib.MulCall({ type: "Int", in1: signal("#Data.in1"), in2: signal("#Data.in2"), in3: signal("#Data.in3"), out1: signal("#Data.out1"), eno: new lib.And(new lib.Coil(signal("#Data.eno"))) })],
    ['SubCall', (instance, signal) => new lib.SubCall({ type: "Int", in1: signal("#Data.in1"), in2: signal("#Data.in2"), out1: signal("#Data.out1"), eno: new lib.And(new lib.Coil(signal("#Data.eno"))) })],
    ['CTUCall', (instance, signal) => new lib.CTUCall({ instanceName: instance, r: signal("#Data.r"), pv: signal("#Data.pv"), q: signal("#Data.q"), cv: signal("#Data.cv"), templateValue: "Int" })],
    ['CTUDCall', (instance, signal) => new lib.CTUDCall({ instanceName: instance, cd: signal("#Data.cd"), r: signal("#Data.r"), ld: signal("#Data.ld"), pv: signal("#Data.pv"), qu: signal("#Data.qu"), qd: signal("#Data.qd"), cv: signal("#Data.cv"), templateValue: "Int" })],
    ['FDBACKCall', (instance, signal) => new lib.FDBACKCall({ instanceName: instance, on: signal("#Data.on"), feedback: signal("#Data.feedback"), qbad_fio: signal("#Data.qbad_fio"), ack_nec: signal("#Data.ack_nec"), ack: signal("#Data.ack"), fdb_time: signal("#Data.fdb_time"), q: signal("#Data.q"), error: signal("#Data.error"), ack_req: signal("#Data.ack_req"), diag: signal("#Data.diag") })],
    ['FTrigCall', (instance, signal) => new lib.FTrigCall({ instanceName: instance, clk: signal("#Data.clk"), q: signal("#Data.q"), eno: new lib.And(new lib.Coil(signal("#Data.eno"))) })],
    ['NTrigCall', (instance, signal) => new lib.NTrigCall({ signal: signal("#Data.signal") })],
    ['PTrigCall', (instance, signal) => new lib.PTrigCall({ signal: signal("#Data.signal") })],
    ['RTrigCall', (instance, signal) => new lib.RTrigCall({ instanceName: instance, clk: signal("#Data.clk"), q: signal("#Data.q"), eno: new lib.And(new lib.Coil(signal("#Data.eno"))) })],
    ['TOFCall', (instance, signal) => new lib.TOFCall({ instanceName: instance, pt: signal("#Data.pt"), q: signal("#Data.q"), et: signal("#Data.et") })],
    ['TONCall', (instance, signal) => new lib.TONCall({ instanceName: instance, pt: signal("#Data.pt"), q: signal("#Data.q"), et: signal("#Data.et") })],
    ['TONRCall', (instance, signal) => new lib.TONRCall({ instanceName: instance, pt: signal("#Data.pt"), r: signal("#Data.r"), q: signal("#Data.q"), et: signal("#Data.et") })],
    ['TPCall', (instance, signal) => new lib.TPCall({ instanceName: instance, pt: signal("#Data.pt"), q: signal("#Data.q"), et: signal("#Data.et") })],
    ['Move', (instance, signal) => new lib.Move(signal('#Data.A', lib.SignalType.Int), signal('#Data.B', lib.SignalType.Int))],
    ['NCoil', (instance, signal) => new lib.NCoil(signal("#Data.signal"), signal("#Data.helpSignal"), signal("#Data.op"))],
    ['Or', (instance, signal) => new lib.Or(signal('#Data.A', lib.SignalType.Int), signal('#Data.B', lib.SignalType.Int))],
    ['S_Move', (instance, signal) => new lib.S_Move(signal('#Data.A', lib.SignalType.Int), signal('#Data.B', lib.SignalType.Int))],
    ['FunctionCall', (_instance, signal) => new lib.FunctionCall({ functionName: 'UserFC', eno: new lib.And(new lib.Coil(signal('#Eno'))) })],
    ['FunctionBlockCall', (instance, signal) => new lib.FunctionBlockCall({ functionName: 'UserFB', instanceName: instance, eno: new lib.And(new lib.Coil(signal('#Eno'))) })],
];

function renderCommands(create: (instance: string, signal: CreateSignal) => lib.IOperationOrSignal, signal: CreateSignal): string[] {
    const output: string[] = [];
    for (const safety of [false, true]) {
        for (const instance of ['Instances.Timer[1]', '"GlobalInstance"']) {
            const code = new lib.CodeBlock('Regression');
            code.safety = safety;
            const operation = create(instance, signal);
            if (operation instanceof lib.FunctionCall)
                for (const parameter of Object.values(operation.iface))
                    if (parameter.operationOrSignal !== null && !operation.children.includes(parameter.operationOrSignal))
                        operation.children.push(parameter.operationOrSignal);
            code.add(new lib.Network('Regression', 'Regression', new lib.And(signal('#Enable'), operation)));
            const block = new lib.Block('Regression', 'Regression', code);
            block.number = 12;
            block.author = 'Test';
            output.push(block.getCode().replace(/\r\n/g, '\n'));
        }
    }
    return output;
}

test.each(commands)('%s output', (_name, create) => {
    const legacy = renderCommands(create, (name, type) => new lib.Signal(name, type));
    const components = renderCommands(create, (name, type) => name.startsWith('#')
        ? lib.Signal.local(name.substring(1).split('.'), type)
        : lib.Signal.global(name.split('.'), type));
    expect(components).toEqual(legacy);
    expect(legacy).toMatchSnapshot();
});

test('signal output across all types and scopes', () => {
    const sb = new lib.StringBuilder();
    for (const type of Object.values(lib.SignalType)) {
        for (const name of ['DB.Struct.Value', '#Data.Struct.Value'])
            new lib.Signal(name, type, 'MyType', 'Description').addXmlToStringBuilder(1, sb);
    }
    for (const name of ['DB.Values[1,2]', '#Data.Values[#Index.Row, 1]', '#Data.Values[#Index.Row, #Index.Column]', 'DB.Values["Index"]', String.raw`#Data.Motor\.Status`])
        new lib.Signal(name).addXmlToStringBuilder(2, sb);
    new lib.FixedSignal('Tag.With.Dots').addXmlToStringBuilder(3, sb);
    new lib.FixedPeripherySignal('Tag.With.Dots').addXmlToStringBuilder(4, sb);
    new lib.Signal(42).addXmlToStringBuilder(5, sb);
    new lib.Signal(true).addXmlToStringBuilder(6, sb);
    expect(sb.toString().replace(/\r\n/g, '\n')).toMatchSnapshot();
});
