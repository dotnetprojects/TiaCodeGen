using NUnit.Framework;
using System.IO;
using System.Xml.Linq;

namespace TiaCodegen.Samples
{
    internal static class XmlBaseline
    {
        // Ignore platform line endings only; keep all XML, whitespace, IDs and comments.
        public static void AssertMatches(string name, string xml)
        {
            XDocument.Parse(xml);
            var path = Path.Combine(TestContext.CurrentContext.TestDirectory, "Baselines", name + ".xml");
            Assert.That(xml.Replace("\r\n", "\n"), Is.EqualTo(File.ReadAllText(path).Replace("\r\n", "\n")), name);
        }
    }
}
