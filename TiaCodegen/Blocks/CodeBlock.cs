using TiaCodegen.Commands;

namespace TiaCodegen.Blocks
{
    public class CodeBlock : BaseOperationOrSignal
    {
        public string Name { get; set; }

        public bool Safety { get; set; }

        public string Comment { get; set; }

        public CodeBlock() : base()
        {
            Name = "";
        }

        public CodeBlock(string name) : base()
        {
            Name = name;
        }
    }
}
