using TiaCodegen.Commands.Coils;
using TiaCodegen.Commands.Signals;
using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Functions
{
    public class NTrigCall : BaseNPCoil, IPartName
    {
        public NTrigCall(Signal signal) : base(signal, null, null)
        {
            PartName = "NBox";
        }

        public string PartName { get; set; }
    }
}
