# fastify-type-provider-json-schema-to-ts

A Type Provider for json-schema-to-ts

## Plugin definition

> **Note**
> When using plugin types, withTypeProvider is not required in order to register the plugin

```ts
const plugin: FastifyPluginAsyncJStT = async function (fastify, _opts) {
  fastify.get(
    "/",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            x: { type: "string" },
            y: { type: "number" },
            z: { type: "boolean" },
          },
          required: ["x", "y", "z"],
        } as const,
      },
    },
    (req) => {
      /// The `x`, `y`, and `z` types are automatically inferred
      const { x, y, z } = req.body;
    }
  );
};
```
