using TiaCodegen.Commands.Signals;
using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Coils
{
    public class Coil : BaseCoil
    {
        public Coil(Signal signal, IOperationOrSignal op = null) : base(signal, op)
        { }
    }
}
