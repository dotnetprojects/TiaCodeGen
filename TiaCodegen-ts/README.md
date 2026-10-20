# @node-projects/tia-codegen-ts

TypeScript port of [TiaCodeGen](https://github.com/dotnetprojects/TiaCodeGen),
a library for generating Siemens TIA Portal ladder logic (KOP) XML.

```sh
npm install @node-projects/tia-codegen-ts
```

```typescript
import { Signal, SignalType } from '@node-projects/tia-codegen-ts';

const running = Signal.local(['Machine', 'Motor.Status']);
const speed = Signal.global(['DB.Process', 'Motor', 'Speed'], SignalType.Real);
```

The package includes ES modules, TypeScript declarations, and a minified bundle
at `dist/index-min.js`. See the repository for code generation examples and API usage.

Stable releases use the `latest` tag; prereleases use `next`:

```sh
npm install @node-projects/tia-codegen-ts@next
```
