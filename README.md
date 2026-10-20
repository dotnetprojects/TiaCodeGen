![.NET](https://github.com/dotnetprojects/TiaCodeGen/workflows/.NET/badge.svg)

# TiaCodeGen
Library to Generate TIA KOP Code via C#

# Signal paths

Use component arrays for new code. Choose the scope explicitly with `Signal.Local`
or `Signal.Global`; local components do not need the legacy `#` prefix.
Dots and backslashes within a component are literal, so no path escaping is needed.

```csharp
var running = Signal.Local(new[] { "Machine", "Motor.Status" });
var speed = Signal.Global(new[] { "DB.Process", "Motor", "Speed" }, SignalType.Real);
var custom = Signal.Local(new[] { "Data", "Value" }, SignalType.Custom,
    customType: "MyType", description: "Process value");

// The array constructor also creates a global signal.
var global = new Signal(new[] { "DB.Process", "Motor.Status" }, SignalType.Bool);
```

The factories and array constructor accept the same optional `signalType`
(default: `Bool`), `customType`, and `description` arguments as the string constructor.
Provide at least one non-empty component. Arrays are copied into an escaped path;
subsequent changes to the caller's array do not affect the signal.

The TypeScript port offers the same API, using camel case for the factories:

```typescript
const running = Signal.local(['Machine', 'Motor.Status']);
const speed = Signal.global(['DB.Process', 'Motor', 'Speed'], SignalType.Real);
const custom = Signal.local(['Data', 'Value'], SignalType.Custom, 'MyType', 'Process value');
const global = new Signal(['DB.Process', 'Motor.Status'], SignalType.Bool);
```

## Legacy string syntax and escaping

The string constructor remains supported. An unescaped dot separates components;
a leading `#` selects local scope. Without `#`, the signal is global.
In a path, `\.` means a literal dot and `\\` means a literal backslash.
Other backslash sequences and a trailing single backslash are preserved.

```csharp
new Signal("#Machine.Motor.Status");       // Machine → Motor → Status (local)
new Signal("DB.Motor.Status", SignalType.Real); // DB → Motor → Status (global)
new Signal(@"#Machine.Motor\.Status");     // Machine → Motor.Status
new Signal(@"#Machine.Motor\\Status");     // Machine → Motor\Status
new Signal(@"#Machine.Motor\\.Status");    // Machine → Motor\ → Status

// Equivalent component syntax, with no path escapes:
Signal.Local(new[] { "Machine", "Motor.Status" });
Signal.Local(new[] { "Machine", @"Motor\Status" });
```

These C# examples use verbatim strings (`@"..."`) to show the actual path escapes.
In a regular C# string, double each backslash again: `"#Machine.Motor\\.Status"`.
In TypeScript, use `String.raw` or double the backslashes in ordinary strings:

```typescript
new Signal(String.raw`#Machine.Motor\.Status`);
new Signal('#Machine.Motor\\.Status'); // Same path
new Signal(String.raw`#Machine.Motor\\Status`); // Literal backslash in the name
```

Existing array expressions remain supported, including numeric, named-constant,
and variable indices. Component arrays also support numeric array suffixes:

```csharp
new Signal("#Data.Values[1,2]");
new Signal("#Data.Values[#Index.Row, 1]");
new Signal("#Data.Values[\"IndexConstant\"]");
new Signal(@"#Data.Values[#Index.Row\.Number, 1]");
Signal.Local(new[] { "Data.With.Dots", "Values[1,2]" });
```

Use the string syntax for expressions with variable index paths. The same path
escaping applies to local function-block instance paths, for example
`new TONCall(@"Instances.Motor\.Timer")`.

`FixedSignal` remains available for a single symbol-table name containing dots.
Its name is used literally in the ordinary signal branch; backslashes are not
decoded there. `FixedPeripherySignal` retains the same behavior and adds periphery
access. The historical special handling of global `Byte`, `String`, and `UDT`
signals is unchanged; use the component API to handle dots consistently across
variable types.

# Publishing releases

Publish a GitHub release with a version tag such as `v3.0.0` or `3.0.0`.
The `Release packages` workflow checks out that tag, tests both libraries, and
uses `3.0.0` for both `@node-projects/tia-codegen-ts` on npm and
`DotNetProjects.TiaCodegen` on NuGet.org. The release title does not set the version.
Draft releases do not publish packages. Pushes to `main` only build and test.

The workflow uploads the built `.tgz` and `.nupkg` to the GitHub release before
publishing those same files to the registries. Publishing runs in independent
jobs so a failed registry job can be rerun without republishing to the other registry.

For prereleases, use a tag such as `v3.0.0-rc.1`. These publish under npm's
`next` dist-tag, leaving `latest` unchanged. A GitHub prerelease must include a
prerelease suffix. Build metadata (`+build`) is rejected because NuGet strips it.
Published package versions are immutable; use a new version for changed contents.

One-time registry configuration:

1. Sign in to npm as an owner of `@node-projects/tia-codegen-ts` and configure
   GitHub Actions trusted publishing for owner `dotnetprojects`, repository
   `TiaCodeGen`, workflow filename `release.yml`, with direct publishing allowed
   and no environment name. With a recent npm CLI, run:

   ```sh
   npm login
   npm trust github @node-projects/tia-codegen-ts --repo=dotnetprojects/TiaCodeGen --file=release.yml --allow-publish
   ```

   Alternatively, use the package's Trusted Publisher settings on npmjs.com.
   The workflow uses OIDC and does not need an `NPM_TOKEN` secret.
2. Create a NuGet.org API key with push permission for `DotNetProjects.TiaCodegen`
   and store it as an Actions secret named `NUGET_API_KEY`, either in this
   repository or in the organization with access granted to this repository. Never commit it.
   The repository's built-in `GITHUB_TOKEN` handles release asset uploads.
3. Commit the workflow and package configuration before tagging a release so the
   release tag includes them. Publish the release from GitHub's Releases page.

# Tests

```text
dotnet test TiaCodegen.slnx
cd TiaCodegen-ts
npm ci
npm test -- --runInBand --ci
npm run build
```

The regression tests compare generated XML with outputs captured before the path
changes. They cover the existing examples, command families, safety output, both
scopes, all signal types, constants, and representative array expressions. They
also compare complete command output using legacy strings and component factories.
Only platform line endings are normalized. The C# fixtures are in
`TiaCodeGen.Tests/Baselines`; the TypeScript fixtures are Jest snapshots in
`TiaCodegen-ts/tests/__snapshots__`.

# Samples

```csharp
            var codeblock = new CodeBlock();
            var nw = new Network("Test1", "Test1en");

            nw.Add(
                new And(
                    Signal.Local(new[] { "Bool1" }),
                new Distributor
                (
                    new RCoil(Signal.Local(new[] { "Bool2" })),
                    new Coil(Signal.Local(new[] { "Bool3" }))
                )));

            codeblock.Add(nw);

            var block = new Block("Test", "blabla", codeblock);
            block.Interface = TestInterface;
            var xml = block.GetCode();
```

This will create following

![](sample1.png)

```csharp
            var codeblock = new CodeBlock();

            var nw = new Network("Test2", "Test2en");
            nw.Add(
                new And(
                    Signal.Local(new[] { "Bool1" }),
                    Signal.Local(new[] { "Bool2" }),
                    new Convert(
                        Signal.Local(new[] { "Real1" }, SignalType.Real),
                        Signal.Local(new[] { "Dint2" }, SignalType.DInt)
                    ),
                    new Distributor(
                        new And(
                            new Move(
                                Signal.Local(new[] { "Real3" }),
                                Signal.Local(new[] { "Real4" })
                            ),
                            new SCoil(Signal.Local(new[] { "Bool3" }))
                        ),
                        new And(
                            new Gt(
                                Signal.Local(new[] { "Real1" }, SignalType.Real),
                                Signal.Local(new[] { "Real2" }, SignalType.Real)
                            ),
                            new SCoil(Signal.Local(new[] { "Bool4" }))
                        )
                    )
                )
            );

            codeblock.Add(nw);

            var block = new Block("Test", "blabla", codeblock);
            block.Interface = TestInterface;
            var xml = block.GetCode();
```

This will create following

![](sample2.png)

```csharp
            var codeblock = new CodeBlock();

            var nw = new Network("Test2", "Test2en");
            nw.Add(
                new Coil(
                    Signal.Local(new[] { "Bool1" }),
                    new And(
                        Signal.Local(new[] { "Bool2" }),
                        new Or(
                             Signal.Local(new[] { "Bool3" }),
                             new And(
                                Signal.Local(new[] { "Bool1" }),
                                Signal.Local(new[] { "Bool4" })
                            )
                        )
                    )
                )
            );

            codeblock.Add(nw);

            var block = new Block("Test", "blabla", codeblock);
            block.Interface = TestInterface;
            var xml = block.GetCode();
```

This will create following

![](sample3.png)
