using System.Collections.Generic;

namespace TiaCodegen.Interfaces
{
    public interface IOperationOrSignal
    {
        List<IOperationOrSignal> Children { get; set; }

        IOperationOrSignal Parent { get; set; }

        ulong OperationId { get; set; }

        bool DoNotCreateContact { get; set; }  //Bei verschachteltem Oder dürfen ab in bestimmten Situationen die inneren Oder nicht als COntacts erzeugt werden!

        int Cardinality { get; set; } //Eingangsebene für ein Oder

        int CreateContactAndFillCardinality(IOperationOrSignal parent); //Erzeugen der Operation ID und füllen der Cardinality für die Oder Anweisungen

        IOperationOrSignal Clone();

        string DebugInfo { get; set; }
    }
}
