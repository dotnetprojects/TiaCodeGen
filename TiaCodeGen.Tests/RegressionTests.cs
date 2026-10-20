using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Text;
using TiaCodegen.Blocks;
using TiaCodegen.Enums;
using TiaCodegen.Interfaces;
using TiaCodegen.Commands;
using TiaCodegen.Commands.Coils;
using TiaCodegen.Commands.Comparisons;
using TiaCodegen.Commands.Functions;
using TiaCodegen.Commands.Functions.Arithmetic;
using TiaCodegen.Commands.Signals;
using Convert = TiaCodegen.Commands.Convert;

namespace TiaCodegen.Samples
{
    public class RegressionTests
    {
        public delegate Signal CreateSignal(string name, SignalType type = SignalType.Bool);

        public static IEnumerable<TestCaseData> Commands()
        {
            yield return new TestCaseData("Not", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new Not(signal("#Data.Negated"))));
            yield return new TestCaseData("And", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new And(operationOrSignals: new IOperationOrSignal[] { signal("#Data.A", SignalType.Int), signal("#Data.B", SignalType.Int) })));
            yield return new TestCaseData("Coil", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new Coil(signal: signal("#Data.signal"), op: signal("#Data.op"))));
            yield return new TestCaseData("PCoil", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new PCoil(signal: signal("#Data.signal"), helpSignal: signal("#Data.helpSignal"), op: signal("#Data.op"))));
            yield return new TestCaseData("RCoil", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new RCoil(signal: signal("#Data.signal"), op: signal("#Data.op"))));
            yield return new TestCaseData("SCoil", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new SCoil(signal: signal("#Data.signal"), op: signal("#Data.op"))));
            yield return new TestCaseData("Eq", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new Eq(operationOrSignals: new IOperationOrSignal[] { signal("#Data.A", SignalType.Int), signal("#Data.B", SignalType.Int) })));
            yield return new TestCaseData("Ge", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new Ge(operationOrSignals: new IOperationOrSignal[] { signal("#Data.A", SignalType.Int), signal("#Data.B", SignalType.Int) })));
            yield return new TestCaseData("Gt", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new Gt(operationOrSignals: new IOperationOrSignal[] { signal("#Data.A", SignalType.Int), signal("#Data.B", SignalType.Int) })));
            yield return new TestCaseData("InRangeCall", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new InRangeCall(min: signal("#Data.min"), @in: signal("#Data.in"), max: signal("#Data.max"), @out: signal("#Data.out"), eno: null)));
            yield return new TestCaseData("Le", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new Le(operationOrSignals: new IOperationOrSignal[] { signal("#Data.A", SignalType.Int), signal("#Data.B", SignalType.Int) })));
            yield return new TestCaseData("Lt", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new Lt(operationOrSignals: new IOperationOrSignal[] { signal("#Data.A", SignalType.Int), signal("#Data.B", SignalType.Int) })));
            yield return new TestCaseData("Ne", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new Ne(operationOrSignals: new IOperationOrSignal[] { signal("#Data.A", SignalType.Int), signal("#Data.B", SignalType.Int) })));
            yield return new TestCaseData("OutRangeCall", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new OutRangeCall(min: signal("#Data.min"), @in: signal("#Data.in"), max: signal("#Data.max"), @out: signal("#Data.out"), eno: null)));
            yield return new TestCaseData("Convert", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new Convert(operationOrSignals: new IOperationOrSignal[] { signal("#Data.A", SignalType.Int), signal("#Data.B", SignalType.Int) })));
            yield return new TestCaseData("Distributor", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new Distributor(operationOrSignals: new IOperationOrSignal[] { signal("#Data.A", SignalType.Int), signal("#Data.B", SignalType.Int) })));
            yield return new TestCaseData("AckGlCall", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new AckGlCall(instanceName: instance, ackGlob: signal("#Data.ackGlob"), eno: new And(new Coil(signal("#Data.eno"))))));
            yield return new TestCaseData("AddCall", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new AddCall(type: "Int", in1: signal("#Data.in1"), in2: signal("#Data.in2"), in3: signal("#Data.in3"), out1: signal("#Data.out1"), eno: new And(new Coil(signal("#Data.eno"))))));
            yield return new TestCaseData("DivCall", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new DivCall(type: "Int", in1: signal("#Data.in1"), in2: signal("#Data.in2"), out1: signal("#Data.out1"), eno: new And(new Coil(signal("#Data.eno"))))));
            yield return new TestCaseData("ModCall", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new ModCall(type: "Int", in1: signal("#Data.in1"), in2: signal("#Data.in2"), out1: signal("#Data.out1"), eno: new And(new Coil(signal("#Data.eno"))))));
            yield return new TestCaseData("MulCall", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new MulCall(type: "Int", in1: signal("#Data.in1"), in2: signal("#Data.in2"), in3: signal("#Data.in3"), out1: signal("#Data.out1"), eno: new And(new Coil(signal("#Data.eno"))))));
            yield return new TestCaseData("SubCall", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new SubCall(type: "Int", in1: signal("#Data.in1"), in2: signal("#Data.in2"), out1: signal("#Data.out1"), eno: new And(new Coil(signal("#Data.eno"))))));
            yield return new TestCaseData("CTUCall", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new CTUCall(instanceName: instance, r: signal("#Data.r"), pv: signal("#Data.pv"), q: signal("#Data.q"), cv: signal("#Data.cv"), templateValue: "Int")));
            yield return new TestCaseData("CTUDCall", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new CTUDCall(instanceName: instance, cd: signal("#Data.cd"), r: signal("#Data.r"), ld: signal("#Data.ld"), pv: signal("#Data.pv"), qu: signal("#Data.qu"), qd: signal("#Data.qd"), cv: signal("#Data.cv"), templateValue: "Int")));
            yield return new TestCaseData("FDBACKCall", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new FDBACKCall(instanceName: instance, on: signal("#Data.on"), feedback: signal("#Data.feedback"), qbad_fio: signal("#Data.qbad_fio"), ack_nec: signal("#Data.ack_nec"), ack: signal("#Data.ack"), fdb_time: signal("#Data.fdb_time"), q: signal("#Data.q"), error: signal("#Data.error"), ack_req: signal("#Data.ack_req"), diag: signal("#Data.diag"))));
            yield return new TestCaseData("FTrigCall", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new FTrigCall(instanceName: instance, clk: signal("#Data.clk"), q: signal("#Data.q"), eno: new And(new Coil(signal("#Data.eno"))))));
            yield return new TestCaseData("NTrigCall", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new NTrigCall(signal: signal("#Data.signal"))));
            yield return new TestCaseData("PTrigCall", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new PTrigCall(signal: signal("#Data.signal"))));
            yield return new TestCaseData("RTrigCall", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new RTrigCall(instanceName: instance, clk: signal("#Data.clk"), q: signal("#Data.q"), eno: new And(new Coil(signal("#Data.eno"))))));
            yield return new TestCaseData("TOFCall", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new TOFCall(instanceName: instance, pt: signal("#Data.pt"), q: signal("#Data.q"), et: signal("#Data.et"))));
            yield return new TestCaseData("TONCall", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new TONCall(instanceName: instance, pt: signal("#Data.pt"), q: signal("#Data.q"), et: signal("#Data.et"))));
            yield return new TestCaseData("TONRCall", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new TONRCall(instanceName: instance, pt: signal("#Data.pt"), r: signal("#Data.r"), q: signal("#Data.q"), et: signal("#Data.et"))));
            yield return new TestCaseData("TPCall", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new TPCall(instanceName: instance, pt: signal("#Data.pt"), q: signal("#Data.q"), et: signal("#Data.et"))));
            yield return new TestCaseData("Move", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new Move(operationOrSignals: new IOperationOrSignal[] { signal("#Data.A", SignalType.Int), signal("#Data.B", SignalType.Int) })));
            yield return new TestCaseData("NCoil", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new NCoil(signal: signal("#Data.signal"), helpSignal: signal("#Data.helpSignal"), op: signal("#Data.op"))));
            yield return new TestCaseData("Or", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new Or(operationOrSignals: new IOperationOrSignal[] { signal("#Data.A", SignalType.Int), signal("#Data.B", SignalType.Int) })));
            yield return new TestCaseData("S_Move", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new S_Move(operationOrSignals: new IOperationOrSignal[] { signal("#Data.A", SignalType.Int), signal("#Data.B", SignalType.Int) })));
            yield return new TestCaseData("FunctionCall", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new TiaCodegen.Commands.Functions.Base.FunctionCall("UserFC", new And(new Coil(signal("#Eno"))))));
            yield return new TestCaseData("FunctionBlockCall", new Func<string, CreateSignal, IOperationOrSignal>((instance, signal) => new TiaCodegen.Commands.Functions.Base.FunctionBlockCall("UserFB", instance, new And(new Coil(signal("#Eno"))))));
        }

        [TestCaseSource(nameof(Commands))]
        public void CommandOutput(string name, Func<string, CreateSignal, IOperationOrSignal> create)
        {
            var legacy = RenderCommands(create, (name, type) => new Signal(name, type));
            var components = RenderCommands(create, (name, type) => name.StartsWith("#")
                ? Signal.Local(name.Substring(1).Split('.'), type)
                : Signal.Global(name.Split('.'), type));
            Assert.That(components, Is.EqualTo(legacy), "Component factories must preserve the entire block output.");
            XmlBaseline.AssertMatches("Command_" + name, legacy);
        }

        private static string RenderCommands(Func<string, CreateSignal, IOperationOrSignal> create, CreateSignal signal)
        {
            var output = new StringBuilder("<Cases>\n");
            foreach (var safety in new[] { false, true })
            foreach (var instance in new[] { "Instances.Timer[1]", "\"GlobalInstance\"" })
            {
                var code = new CodeBlock("Regression") { Safety = safety };
                var operation = create(instance, signal);
                if (operation is TiaCodegen.Commands.Functions.Base.FunctionCall call)
                    foreach (var parameter in call.Interface.Values)
                        if (parameter.OperationOrSignal != null && !call.Children.Contains(parameter.OperationOrSignal))
                            call.Children.Add(parameter.OperationOrSignal);
                code.Add(new Network("Regression", "Regression", new And(signal("#Enable"), operation)));
                output.AppendLine(new Block("Regression", "Regression", code) { Number = 12, Author = "Test", TitleEnglish = "English", Comment = "Comment", CommentEnglish = "Comment en" }.GetCode());
            }
            output.AppendLine("</Cases>");
            return output.ToString();
        }

        [Test]
        public void SignalOutput()
        {
            var output = new StringBuilder("<Cases>\n");
            foreach (SignalType type in Enum.GetValues(typeof(SignalType)))
            foreach (var name in new[] { "DB.Struct.Value", "#Data.Struct.Value" })
                new Signal(name, type, "MyType", "Description").AddXmlToStringBuilder(1, output);
            foreach (var name in new[] { "DB.Values[1,2]", "#Data.Values[#Index.Row, 1]", "#Data.Values[#Index.Row, #Index.Column]", "DB.Values[\"Index\"]", @"#Data.Motor\.Status" })
                new Signal(name).AddXmlToStringBuilder(2, output);
            new FixedSignal("Tag.With.Dots").AddXmlToStringBuilder(3, output);
            new FixedPeripherySignal("Tag.With.Dots").AddXmlToStringBuilder(4, output);
            new Signal(42).AddXmlToStringBuilder(5, output);
            new Signal(true).AddXmlToStringBuilder(6, output);
            output.AppendLine("</Cases>");
            XmlBaseline.AssertMatches("Signals", output.ToString());
        }
    }
}

