using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Comparisons
{
    public class Ne : CompareOperator // <>
    {
        public Ne(params IOperationOrSignal[] operationOrSignals)
            : base(operationOrSignals)
        { }
    }
}
