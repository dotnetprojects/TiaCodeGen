using NUnit.Framework;
using TiaCodegen.Blocks;
using TiaCodegen.Commands;
using TiaCodegen.Commands.Coils;
using TiaCodegen.Commands.Comparisons;
using TiaCodegen.Commands.Signals;
using TiaCodegen.Enums;

namespace TiaCodegen.Samples
{
    [TestFixture]
    public class SampleTests
    {
        [Test]
        public void CreateBlock()
        {
            var codeblock = new CodeBlock();
            var nw = new Network("Test1");

            nw.Add(
                new And(
                    new Signal("#BoolA"),
                new Distributor
                (
                    new RCoil(new Signal("#BoolB")),
                    new Coil(new Signal("#BoolC"))
                )));

            codeblock.Add(nw);

            var block = new Block("Test", "blabla", codeblock);
            var xml = block.GetCode();
        }

        [Test]
        public void CreateBlock2()
        {
            var codeblock = new CodeBlock();

            var nw = new Network("Test2");
            nw.Add(
            new And(
                new Signal("#BoolA"),
                new Signal("#BoolB"),
                new Convert(
                    new Signal("#RealA", SignalType.Real),
                    new Signal("#DintA", SignalType.DInt)
                ),
                new Distributor(
                    new And(
                        new Move(
                            new Signal("#RealC"),
                            new Signal("#RealD")
                        ),
                        new SCoil(new Signal("#BoolC"))
                    ),
                    new And(
                        new Gt(
                            new Signal("#RealA", SignalType.Real),
                            new Signal("#RealB", SignalType.Real)
                        ),
                        new SCoil(new Signal("#BoolD"))
                    )
                )
            )
        );

            codeblock.Add(nw);

            var block = new Block("Test", "blabla", codeblock);
            var xml = block.GetCode();
        }
    }
}
