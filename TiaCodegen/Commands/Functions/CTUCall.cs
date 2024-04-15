using System.Linq;
using TiaCodegen.Commands.Functions.Base;
using TiaCodegen.Enums;
using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Functions
{
    public class CTUCall : SystemFunctionBlockCall
    {
        public CTUCall(string instanceName,
            IOperationOrSignal cu = null,
            IOperationOrSignal r = null,
            IOperationOrSignal pv = null,
            IOperationOrSignal q = null,
            IOperationOrSignal cv = null) : base("CTU", instanceName, null)
        {
            Interface["CU"] = new IOperationOrSignalDirectionWrapper(cu, Direction.Input);
            Interface["R"] = new IOperationOrSignalDirectionWrapper(r, Direction.Input);
            Interface["PV"] = new IOperationOrSignalDirectionWrapper(pv, Direction.Input);
            Interface["Q"] = new IOperationOrSignalDirectionWrapper(q, Direction.Output);
            Interface["CV"] = new IOperationOrSignalDirectionWrapper(cv, Direction.Output);

            TemplateValueName = "value_type";
            TemplateValueType = "Type";
            TemplateValue = "Int";
            HasNoEn = true;

            Children.AddRange(Interface.Values.Where(x => x.OperationOrSignal != null).Select(x => x.OperationOrSignal));
        }
    }
}
