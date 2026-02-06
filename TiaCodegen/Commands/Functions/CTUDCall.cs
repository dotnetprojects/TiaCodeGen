using System.Linq;
using TiaCodegen.Commands.Functions.Base;
using TiaCodegen.Enums;
using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Functions
{
    public class CTUDCall : SystemFunctionBlockCall
    {
        public CTUDCall(string instanceName,
            IOperationOrSignal cd = null,
            IOperationOrSignal r = null,
            IOperationOrSignal ld = null,
            IOperationOrSignal pv = null,
            IOperationOrSignal qu = null,
            IOperationOrSignal qd = null,
            IOperationOrSignal cv = null) : base("CTUD", instanceName, null)
        {
            Interface["CD"] = new IOperationOrSignalDirectionWrapper(cd, Direction.Input);
            Interface["R"] = new IOperationOrSignalDirectionWrapper(r, Direction.Input);
            Interface["LD"] = new IOperationOrSignalDirectionWrapper(ld, Direction.Input);
            Interface["PV"] = new IOperationOrSignalDirectionWrapper(pv, Direction.Input);
            Interface["QU"] = new IOperationOrSignalDirectionWrapper(qu, Direction.Output);
            Interface["QD"] = new IOperationOrSignalDirectionWrapper(qd, Direction.Output);
            Interface["CV"] = new IOperationOrSignalDirectionWrapper(cv, Direction.Output);

            TemplateValueName = "value_type";
            TemplateValueType = "Type";
            TemplateValue = "Int";
            HasNoEn = true;

            Children.AddRange(Interface.Values.Where(x => x.OperationOrSignal != null).Select(x => x.OperationOrSignal));
        }
    }
}
