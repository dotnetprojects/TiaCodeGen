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
        const string TestInterface=@"
<Interface>
	<Sections xmlns=""http://www.siemens.com/automation/Openness/SW/Interface/v3"">
	  <Section Name=""Input"">
		<Member Name=""Initial_Call"" Datatype=""Bool"" Accessibility=""Public"" Informative=""true"">
		  <Comment>
			<MultiLanguageText Lang=""en-US"">Initial call of this OB</MultiLanguageText>
		  </Comment>
		</Member>
		<Member Name=""Remanence"" Datatype=""Bool"" Accessibility=""Public"" Informative=""true"">
		  <Comment>
			<MultiLanguageText Lang=""en-US"">=True, if remanent data are available</MultiLanguageText>
		  </Comment>
		</Member>
	  </Section>
	  <Section Name=""Temp"">
		<Member Name=""Daten"" Datatype=""Struct"">
		  <Member Name=""Bool1"" Datatype=""Bool"" />
		  <Member Name=""Bool2"" Datatype=""Bool"" />
		  <Member Name=""Bool3"" Datatype=""Bool"" />
		  <Member Name=""Bool4"" Datatype=""Bool"" />
		  <Member Name=""Dint1"" Datatype=""DInt"" />
		  <Member Name=""Dint2"" Datatype=""DInt"" />
		  <Member Name=""Dint3"" Datatype=""DInt"" />
		  <Member Name=""Dint4"" Datatype=""DInt"" />
		  <Member Name=""Real1"" Datatype=""Real"" />
		  <Member Name=""Real2"" Datatype=""Real"" />
		  <Member Name=""Real3"" Datatype=""Real"" />
		  <Member Name=""Real4"" Datatype=""Real"" />
		</Member>
	  </Section>
	  <Section Name=""Constant"" />
	</Sections>
</Interface>";

        [Test]
        public void CreateBlock1()
        {
            var codeblock = new CodeBlock();
            var nw = new Network("Test1");

            nw.Add(
                new And(
                    new Signal("#Bool1"),
                new Distributor
                (
                    new RCoil(new Signal("#Bool2")),
                    new Coil(new Signal("#Bool3"))
                )));

            codeblock.Add(nw);

            var block = new Block("Test", "blabla", codeblock);
            block.Interface = TestInterface;
            var xml = block.GetCode();
        }

        [Test]
        public void CreateBlock2()
        {
            var codeblock = new CodeBlock();

            var nw = new Network("Test2");
            nw.Add(
            new And(
                new Signal("#Bool1"),
                new Signal("#Bool2"),
                new Convert(
                    new Signal("#Real1", SignalType.Real),
                    new Signal("#Dint2", SignalType.DInt)
                ),
                new Distributor(
                    new And(
                        new Move(
                            new Signal("#Real3"),
                            new Signal("#Real4")
                        ),
                        new SCoil(new Signal("#Bool3"))
                    ),
                    new And(
                        new Gt(
                            new Signal("#Real1", SignalType.Real),
                            new Signal("#Real2", SignalType.Real)
                        ),
                        new SCoil(new Signal("#Bool4"))
                    )
                )
            )
        );

            codeblock.Add(nw);

            var block = new Block("Test", "blabla", codeblock);
            var xml = block.GetCode();
            block.Interface = TestInterface;
        }
    }
}
