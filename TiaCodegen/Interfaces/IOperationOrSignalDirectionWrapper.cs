using TiaCodegen.Enums;

namespace TiaCodegen.Interfaces
{
    public class IOperationOrSignalDirectionWrapper
    {
        public IOperationOrSignal OperationOrSignal { get; set; }

        public Direction Direction { get; set; }

        public int Length { get; set; }

        public SignalType? Type { get; set; }

        public IOperationOrSignalDirectionWrapper(IOperationOrSignal operationOrSignal, Direction direction, SignalType? type = null, int length = 0)
        {
            OperationOrSignal = operationOrSignal;
            Direction = direction;
            Length = length;
            Type = type;
        }
    }
}
