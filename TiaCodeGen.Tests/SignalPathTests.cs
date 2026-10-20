using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using TiaCodegen.Blocks;
using TiaCodegen.Commands.Functions;
using TiaCodegen.Commands.Functions.Base;
using TiaCodegen.Commands.Signals;
using TiaCodegen.Enums;

namespace TiaCodegen.Samples
{
    public class SignalPathTests
    {
        private static XElement Xml(Signal signal)
        {
            var sb = new StringBuilder();
            signal.AddXmlToStringBuilder(1, sb);
            return XElement.Parse(sb.ToString());
        }

        private static string[] Names(XElement xml) => xml.Element("Symbol").Elements("Component").Select(c => (string)c.Attribute("Name")).ToArray();

        [TestCase(@"#Machine.Motor\.Status", new[] { "Machine", "Motor.Status" })]
        [TestCase(@"DB.Motor\.Status.Running", new[] { "DB", "Motor.Status", "Running" })]
        [TestCase(@"#A\\B.Value", new[] { @"A\B", "Value" })]
        [TestCase(@"#A\\.B", new[] { @"A\", "B" })]
        [TestCase(@"#A\\\.B", new[] { @"A\.B" })]
        [TestCase(@"#A\\\\.B", new[] { @"A\\", "B" })]
        [TestCase(@"#A\.B\\C", new[] { @"A.B\C" })]
        [TestCase(@"#A\q.B", new[] { @"A\q", "B" })]
        [TestCase(@"#A\", new[] { @"A\" })]
        [TestCase("#🌴.B", new[] { "🌴", "B" })]
        [TestCase("#A..B", new[] { "A", "", "B" })]
        public void LegacyPathsDecodeEscapes(string path, string[] expected)
        {
            var xml = Xml(new Signal(path));
            Assert.That(Names(xml), Is.EqualTo(expected));
            Assert.That((string)xml.Attribute("Scope"), Is.EqualTo(path.StartsWith("#") ? "LocalVariable" : "GlobalVariable"));
        }

        private static IEnumerable<SignalType> VariableTypes => Enum.GetValues(typeof(SignalType)).Cast<SignalType>()
            .Where(t => !t.ToString().StartsWith("Constant") && t != SignalType.Void);

        [TestCaseSource(nameof(VariableTypes))]
        public void AllVariableTypesSupportBothScopesAndMetadata(SignalType type)
        {
            var components = new[] { "DB.Process", @"Motor\Status", "🌴" };
            foreach (var local in new[] { false, true })
            {
                var signal = local ? Signal.Local(components, type, "CustomType", "Description") : Signal.Global(components, type, "CustomType", "Description");
                var legacy = new Signal((local ? "#" : "") + @"DB\.Process.Motor\\Status.🌴", type, "CustomType", "Description");
                var xml = Xml(signal);
                Assert.That(Names(xml), Is.EqualTo(components));
                Assert.That(xml.ToString(), Is.EqualTo(Xml(legacy).ToString()));
                Assert.That(signal.SignalType, Is.EqualTo(type));
                Assert.That(signal.CustomType, Is.EqualTo("CustomType"));
                Assert.That(signal.Description, Is.EqualTo("Description"));
            }
        }

        [Test]
        public void ComponentConstructorIsGlobalAndCopiesInput()
        {
            var components = new[] { "#DB.With.Dots", @"Motor\", "Value" };
            var signal = new Signal(components, SignalType.Real, "Custom", "Description");
            components[0] = "Changed";
            var xml = Xml(signal);
            Assert.That((string)xml.Attribute("Scope"), Is.EqualTo("GlobalVariable"));
            Assert.That(Names(xml), Is.EqualTo(new[] { "#DB.With.Dots", @"Motor\", "Value" }));
            Assert.That(signal.SignalType, Is.EqualTo(SignalType.Real));
            Assert.That(signal.CustomType, Is.EqualTo("Custom"));
            Assert.That(signal.Description, Is.EqualTo("Description"));
        }

        [Test]
        public void CloningPreservesExplicitScopeAndMetadata()
        {
            foreach (var signal in new[] {
                Signal.Global(new[] { "#Literal", "A.B" }, SignalType.Custom, "MyType", "Description"),
                Signal.Local(new[] { "#Literal", @"A\B" }, SignalType.Real, "MyType", "Description") })
            {
                var clone = (Signal)signal.Clone();
                Assert.That(Xml(clone).ToString(), Is.EqualTo(Xml(signal).ToString()));
                Assert.That(clone.SignalType, Is.EqualTo(signal.SignalType));
                Assert.That(clone.CustomType, Is.EqualTo(signal.CustomType));
                Assert.That(clone.Description, Is.EqualTo(signal.Description));
                Assert.That(clone.Children, Is.Not.SameAs(signal.Children));
            }
        }

        [Test]
        public void InvalidComponentsFailEarly()
        {
            Assert.Throws<ArgumentNullException>(() => new Signal((string[])null));
            foreach (var components in new[] { new string[0], new[] { "" }, new[] { "A", null } })
            {
                Assert.Throws<ArgumentException>(() => new Signal(components));
                Assert.Throws<ArgumentException>(() => Signal.Local(components));
                Assert.Throws<ArgumentException>(() => Signal.Global(components));
            }
        }

        [TestCase(@"#DB\.Name.Values[1,2]", "DB.Name", "LiteralConstant", "1", "2")]
        [TestCase(@"#DB\.Name.Values[#Index.Row\.Number, 1]", "DB.Name", "LocalVariable", "Row.Number", "1")]
        [TestCase(@"#DB\.Name.Values[#Index.Row\\Number, #Index.Column\.Number]", "DB.Name", "LocalVariable", @"Row\Number", "Column.Number")]
        public void EscapesWorkInsideAndOutsideArrayIndices(string path, string root, string indexScope, string first, string second)
        {
            var xml = Xml(new Signal(path));
            Assert.That(Names(xml), Is.EqualTo(new[] { root, "Values" }));
            var indices = xml.Element("Symbol").Elements("Component").Last().Elements("Access").ToArray();
            Assert.That((string)indices[0].Attribute("Scope"), Is.EqualTo(indexScope));
            Assert.That(indices[0].ToString(), Does.Contain(first));
            Assert.That(indices[1].ToString(), Does.Contain(second));
        }

        [Test]
        public void NumericArraySuffixesHaveIdenticalOutputWithComponents()
        {
            var signal = Signal.Local(new[] { "Data.With.Dots", "Values[1,2]" });
            Assert.That(Xml(signal).ToString(), Is.EqualTo(Xml(new Signal(@"#Data\.With\.Dots.Values[1,2]")).ToString()));
        }

        [Test]
        public void FixedSignalsKeepTheirLiteralNames()
        {
            var name = @"Tag.With\.Dots\\And🌴";
            Assert.That(Names(Xml(new FixedSignal(name))), Is.EqualTo(new[] { name }));
            Assert.That(Names(Xml(new FixedPeripherySignal(name))), Is.EqualTo(new[] { name }));
        }

        [TestCase(false)]
        [TestCase(true)]
        public void FunctionBlockInstancesUseTheSameEscaping(bool system)
        {
            var code = new CodeBlock();
            FunctionBlockCall call = system ? (FunctionBlockCall)new TONCall(@"Instances.Motor\.Timer\\State") : new FunctionBlockCall("UserFB", @"Instances.Motor\.Timer\\State");
            code.Add(new Network("Test", "Test", call));
            var xml = XDocument.Parse(new Block("Test", "Test", code).GetCode());
            var instance = xml.Descendants().Single(e => e.Name.LocalName == "Instance");
            Assert.That(instance.Elements().Select(c => (string)c.Attribute("Name")), Is.EqualTo(new[] { "Instances", @"Motor.Timer\State" }));
        }
    }
}
