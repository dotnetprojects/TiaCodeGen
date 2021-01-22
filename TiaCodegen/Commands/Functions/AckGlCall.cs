using System.Linq;
using TiaCodegen.Commands.Functions.Base;
using TiaCodegen.Enums;
using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Functions
{
    public class AckGlCall : SystemFunctionBlockCall
    {
        public AckGlCall(string instanceName,
            IOperationOrSignal ackGlob = null,
            IOperationOrSignal eno = null) : base("ACK_GL", instanceName, eno)
        {
            Interface["ACK_GLOB"] = new IOperationOrSignalDirectionWrapper(ackGlob, Direction.Input);

            AdditionalSafetyTemplateValues = @"
<TemplateValue Name=""f_user_card"" Type=""Cardinality"">1</TemplateValue>
<TemplateValue Name=""f_image_card"" Type=""Cardinality"">0</TemplateValue>
<TemplateValue Name=""codedbool_type"" Type=""Type"">DInt</TemplateValue>
";

            Children.AddRange(Interface.Values.Where(x => x.OperationOrSignal != null).Select(x => x.OperationOrSignal));
        }
    }
}
