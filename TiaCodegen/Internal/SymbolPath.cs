using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace TiaCodegen.Internal
{
    internal static class SymbolPath
    {
        // Keep escape sequences intact until after splitting. In particular, \\.
        // has an escaped backslash followed by a path separator.
        public static string[] Split(string path)
        {
            var parts = new List<string>();
            var part = new StringBuilder();
            for (var i = 0; i < path.Length; i++)
            {
                var c = path[i];
                if (c == '\\' && i + 1 < path.Length && (path[i + 1] == '\\' || path[i + 1] == '.'))
                    part.Append(c).Append(path[++i]);
                else if (c == '.')
                {
                    parts.Add(part.ToString());
                    part.Clear();
                }
                else
                    part.Append(c);
            }
            parts.Add(part.ToString());
            return parts.ToArray();
        }

        public static string Unescape(string component)
        {
            var result = new StringBuilder();
            for (var i = 0; i < component.Length; i++)
            {
                var c = component[i];
                if (c == '\\' && i + 1 < component.Length && (component[i + 1] == '\\' || component[i + 1] == '.'))
                    c = component[++i];
                result.Append(c);
            }
            return result.ToString();
        }

        public static string Escape(string component) => component.Replace("\\", "\\\\").Replace(".", "\\.");

        public static string Join(string[] components)
        {
            if (components == null)
                throw new ArgumentNullException(nameof(components));
            if (components.Length == 0 || components.Any(string.IsNullOrEmpty))
                throw new ArgumentException("Provide at least one non-empty path component.", nameof(components));
            return string.Join(".", components.Select(Escape));
        }
    }
}
