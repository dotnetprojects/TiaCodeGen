using TiaCodegen.Commands.Signals;
using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Coils
{
    public class RCoil : BaseCoil
    {
        public RCoil(Signal signal, IOperationOrSignal op = null) : base(signal, op)
        { }
    }
}
