using System.Linq;
using TiaCodegen.Commands.Functions.Base;
using TiaCodegen.Enums;
using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Functions
{
    public class TONRCall : SystemFunctionBlockCall
    {
        public TONRCall(string instanceName,
            IOperationOrSignal pt = null,
            IOperationOrSignal r = null,
            IOperationOrSignal q = null,
            IOperationOrSignal et = null) : base("TONR", instanceName, null)
        {
            Interface["PT"] = new IOperationOrSignalDirectionWrapper(pt, Direction.Input);
            Interface["R"] = new IOperationOrSignalDirectionWrapper(r, Direction.Input);
            Interface["Q"] = new IOperationOrSignalDirectionWrapper(q, Direction.Output);
            Interface["ET"] = new IOperationOrSignalDirectionWrapper(et, Direction.Output);

            TemplateValueName = "time_type";
            TemplateValueType = "Type";
            TemplateValue = "Time";
            HasNoEn = true;

            Children.AddRange(Interface.Values.Where(x => x.OperationOrSignal != null).Select(x => x.OperationOrSignal));
        }
    }
}
