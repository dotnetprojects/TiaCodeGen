using TiaCodegen.Interfaces;

namespace DotNetProjects.TiaCodegen.Extensions
{
    public static class OperationOrSignalExtensions
    {
        public static T TryGetParent<T>(this IOperationOrSignal op) where T : IOperationOrSignal
        {
            var chk = op.Parent;
            while (chk != null)
            {
                if (chk is T)
                    return (T)chk;
                chk = chk.Parent;
            }
            return default(T);
        }
    }
}
