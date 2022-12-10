# fastify-type-provider-json-schema-to-ts

A Type Provider for json-schema-to-ts

## Plugin definition

> **Note**
> When using plugin types, withTypeProvider is not required in order to register the plugin

```ts
const plugin: FastifyPluginAsyncJsonSchemaToTs = async function (
  fastify,
  _opts
) {
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

## Using References from a Shared Schema

JsonSchemaToTsProvider takes a generic that can be passed in the Shared Schema
as shown in the following example

```ts
const userSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    givenName: { type: "string" },
    familyName: { type: "string" },
  },
  required: ["givenName", "familyName"],
} as const;

const sharedSchema = {
  $id: "shared-schema",
  definitions: {
    user: userSchema,
  },
} as const;

// then when using JsonSchemaToTsProvider, the shared schema is passed through the generic
// references takes an array so can pass in multiple shared schema
const fastify =
  Fastify().withTypeProvider<
    JsonSchemaToTsProvider<{ references: [typeof sharedSchema] }>
  >();

// now reference the shared schema like the following
fastify.get(
  "/profile",
  {
    schema: {
      body: {
        type: "object",
        properties: {
          user: {
            $ref: "shared-schema#/definitions/user",
          },
        },
        required: ['user'],
      },
    } as const,
  },
  (req) => {
    // givenName and familyName will be correctly typed as strings!
    const { givenName, familyName } = req.body.user;
  }
);
```
