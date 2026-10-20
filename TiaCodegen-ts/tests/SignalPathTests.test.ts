import { Block, CodeBlock, FixedPeripherySignal, FixedSignal, FunctionBlockCall, Network, Signal, SignalType, StringBuilder, TONCall } from '../src/index';

function xml(signal: Signal): string {
    const sb = new StringBuilder();
    signal.addXmlToStringBuilder(1, sb);
    return sb.toString();
}

function names(value: string): string[] {
    return Array.from(value.matchAll(/<Component Name="([^"]*)"/g), m => m[1]);
}

test.each<[string, string[]]>([
    [String.raw`#Machine.Motor\.Status`, ['Machine', 'Motor.Status']],
    [String.raw`DB.Motor\.Status.Running`, ['DB', 'Motor.Status', 'Running']],
    [String.raw`#A\\B.Value`, [String.raw`A\B`, 'Value']],
    [String.raw`#A\\.B`, ['A\\', 'B']],
    [String.raw`#A\\\.B`, [String.raw`A\.B`]],
    [String.raw`#A\\\\.B`, [String.raw`A\\`, 'B']],
    [String.raw`#A\.B\\C`, [String.raw`A.B\C`]],
    [String.raw`#A\q.B`, [String.raw`A\q`, 'B']],
    ['#A\\', ['A\\']],
    ['#🌴.B', ['🌴', 'B']],
    ['#A..B', ['A', '', 'B']],
])('legacy path %s decodes escapes', (path, expected) => {
    const result = xml(new Signal(path));
    expect(names(result)).toEqual(expected);
    expect(result).toContain(`Scope="${path.startsWith('#') ? 'LocalVariable' : 'GlobalVariable'}"`);
});

const variableTypes = Object.values(SignalType).filter(t => !t.startsWith('Constant') && t !== SignalType.Void);
test.each(variableTypes)('%s supports components, both scopes and metadata', type => {
    const components = ['DB.Process', String.raw`Motor\Status`, '🌴'];
    for (const local of [false, true]) {
        const signal = local ? Signal.local(components, type, 'CustomType', 'Description') : Signal.global(components, type, 'CustomType', 'Description');
        const legacy = new Signal((local ? '#' : '') + String.raw`DB\.Process.Motor\\Status.🌴`, type, 'CustomType', 'Description');
        expect(names(xml(signal))).toEqual(components);
        expect(xml(signal)).toEqual(xml(legacy));
        expect(signal.signalType).toBe(type);
        expect(signal.customType).toBe('CustomType');
        expect(signal.description).toBe('Description');
    }
});

test('component constructor is global and copies the input', () => {
    const components = ['#DB.With.Dots', 'Motor\\', 'Value'];
    const signal = new Signal(components, SignalType.Real, 'Custom', 'Description');
    components[0] = 'Changed';
    expect(xml(signal)).toContain('Scope="GlobalVariable"');
    expect(names(xml(signal))).toEqual(['#DB.With.Dots', 'Motor\\', 'Value']);
    expect(signal.signalType).toBe(SignalType.Real);
    expect(signal.customType).toBe('Custom');
    expect(signal.description).toBe('Description');
});

test('cloning preserves explicit scope and metadata', () => {
    for (const signal of [
        Signal.global(['#Literal', 'A.B'], SignalType.Custom, 'MyType', 'Description'),
        Signal.local(['#Literal', String.raw`A\B`], SignalType.Real, 'MyType', 'Description'),
    ]) {
        const clone = signal.clone() as Signal;
        expect(xml(clone)).toBe(xml(signal));
        expect(clone.signalType).toBe(signal.signalType);
        expect(clone.customType).toBe(signal.customType);
        expect(clone.description).toBe(signal.description);
        expect(clone.children).not.toBe(signal.children);
    }
});

test('invalid components fail early', () => {
    for (const components of [[], [''], ['A', null]] as string[][]) {
        expect(() => new Signal(components)).toThrow();
        expect(() => Signal.local(components)).toThrow();
        expect(() => Signal.global(components)).toThrow();
    }
});

test.each<[string, string[]]>([
    [String.raw`#DB\.Name.Values[1,2]`, ['DB.Name', 'Values']],
    [String.raw`#DB\.Name.Values[#Index.Row\.Number, 1]`, ['DB.Name', 'Values', 'Index', 'Row.Number']],
    [String.raw`#DB\.Name.Values[#Index.Row\\Number, #Index.Column\.Number]`, ['DB.Name', 'Values', 'Index', String.raw`Row\Number`, 'Index', 'Column.Number']],
])('escapes work inside and outside array indices: %s', (path, expected) => {
    const result = xml(new Signal(path));
    expect(names(result)).toEqual(expected);
    expect(result).toContain('<Access Scope="LocalVariable"');
});

test('numeric array suffixes have identical output with components', () => {
    expect(xml(Signal.local(['Data.With.Dots', 'Values[1,2]'])))
        .toBe(xml(new Signal(String.raw`#Data\.With\.Dots.Values[1,2]`)));
});

test('fixed signals keep their literal names', () => {
    const name = String.raw`Tag.With\.Dots\\And🌴`;
    expect(names(xml(new FixedSignal(name)))).toEqual([name]);
    expect(names(xml(new FixedPeripherySignal(name)))).toEqual([name]);
});

test.each([false, true])('function block instances use the same escaping (system=%s)', system => {
    const code = new CodeBlock();
    const instanceName = String.raw`Instances.Motor\.Timer\\State`;
    const call = system ? new TONCall({ instanceName }) : new FunctionBlockCall({ functionName: 'UserFB', instanceName });
    code.add(new Network('Test', 'Test', call));
    const result = new Block('Test', 'Test', code).getCode();
    const instance = result.match(/<Instance[^>]*>([\s\S]*?)<\/Instance>/)![1];
    expect(names(instance)).toEqual(['Instances', String.raw`Motor.Timer\State`]);
});
