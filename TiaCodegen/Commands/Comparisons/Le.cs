using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Comparisons
{
    public class Le : CompareOperator // <=
    {
        public Le(params IOperationOrSignal[] operationOrSignals)
            : base(operationOrSignals)
        { }
    }
}
