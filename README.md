# @fastify/type-provider-json-schema-to-ts

[![CI](https://github.com/fastify/fastify-type-provider-json-schema-to-ts/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/fastify/fastify-type-provider-json-schema-to-ts/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/@fastify/type-provider-json-schema-to-ts.svg?style=flat)](https://www.npmjs.com/package/@fastify/type-provider-json-schema-to-ts)
[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-brightgreen?style=flat)](https://github.com/neostandard/neostandard)

A Type Provider for [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts)

## Install

```bash
npm i @fastify/type-provider-json-schema-to-ts
```

## TypeScript requirements

It is required to use `TypeScript@4.3` or above with
[`strict`](https://www.typescriptlang.org/tsconfig#strict)
mode enabled and
[`noStrictGenericChecks`](https://www.typescriptlang.org/tsconfig#noStrictGenericChecks)
disabled. You may take the following configuration (`tsconfig.json`) as an example:

```json
{
  "compilerOptions": {
    "strict": true,
    "noStrictGenericChecks": false
  }
}
```

## Plugin definition

> **Note**
> When using plugin types, `withTypeProvider` is not required to register the plugin.

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
      // The `x`, `y`, and `z` types are automatically inferred
      const { x, y, z } = req.body;
    }
  );
};
```

## Setting FromSchema for the validator and serializer

You can set the `FromSchema` settings for things like [`references`](https://github.com/ThomasAribart/json-schema-to-ts#references) and [`deserialization`](https://github.com/ThomasAribart/json-schema-to-ts#deserialization) for the validation and serialization schema by setting `ValidatorSchemaOptions` and `SerializerSchemaOptions` type parameters.
You can use the `deserialize` option in `SerializerSchemaOptions` to allow Date objects in place of date-time strings or other special serialization rules handled by [fast-json-stringify](https://github.com/fastify/fast-json-stringify?tab=readme-ov-file#specific-use-cases).

```ts
const userSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    givenName: { type: "string" },
    familyName: { type: "string" },
  },
  required: ["givenName", "familyName"],
} as const satisfies JSONSchema;

const sharedSchema = {
  $id: "shared-schema",
  definitions: {
    user: userSchema,
  },
} as const satisfies JSONSchema;

const userProfileSchema = {
  $id: "userProfile",
  type: "object",
  additionalProperties: false,
  properties: {
    user: {
      $ref: "shared-schema#/definitions/user",
    },
    joinedAt: { type: "string", format: "date-time" },
  },
  required: ["user", "joinedAt"],
} as const satisfies JSONSchema


type UserProfile = FromSchema<typeof userProfileSchema, {
  references: [typeof sharedSchema]
  deserialize: [{ pattern: { type: "string"; format: "date-time" }; output: Date }]
}>;

// Use JsonSchemaToTsProvider with shared schema references
const fastify = Fastify().withTypeProvider<
  JsonSchemaToTsProvider<{
    ValidatorSchemaOptions: { references: [typeof sharedSchema] }
    SerializerSchemaOptions: {
      references: [typeof userProfileSchema]
      deserialize: [{ pattern: { type: "string"; format: "date-time" }; output: Date }]
    }
  }>
>()

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
      response: {
        200: { $ref: "userProfile#" },
      },
    } as const,
  },
  (req, reply) => {
    // `givenName` and `familyName` are correctly typed as strings
    const { givenName, familyName } = req.body.user;

    // Construct a compatible response type
    const profile: UserProfile = {
      user: { givenName: "John", familyName: "Doe" },
      joinedAt: new Date(), // Returning a Date object
    };

    // A type error is surfaced if profile doesn't match the serialization schema
    reply.send(profile)
  }
)
```

## Using References in a Plugin Definition

When defining a plugin, shared schema references and deserialization options can also be used with `FastifyPluginAsyncJsonSchemaToTs` and `FastifyPluginCallbackJsonSchemaToTs`.

### Example

```ts
const schemaPerson = {
  $id: "schema:person",
  type: "object",
  additionalProperties: false,
  properties: {
    givenName: { type: "string" },
    familyName: { type: "string" },
    joinedAt: { type: "string", format: "date-time" },
  },
  required: ["givenName", "familyName"],
} as const satisfies JSONSchema;

const plugin: FastifyPluginAsyncJsonSchemaToTs<{
  ValidatorSchemaOptions: { references: [typeof schemaPerson] }
  SerializerSchemaOptions: {
    references: [typeof schemaPerson]
    deserialize: [{ pattern: { type: "string"; format: "date-time" }; output: Date }]
  };
}> = async function (fastify, _opts) {
  fastify.addSchema(schemaPerson)

  fastify.get(
    "/profile",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            user: {
              $ref: "schema:person",
            },
          },
          required: ['user'],
        },
        response: {
          200: { $ref: "schema:person" },
        },
      }, // as const satisfies JSONSchema is not required thanks to FastifyPluginAsyncJsonSchemaToTs
    },
    (req, reply) => {
      // `givenName`, `familyName`, and `joinedAt` are correctly typed as strings and validated for format.
      const { givenName, familyName, joinedAt } = req.body.user;

      // Send a serialized response
      reply.send({
        givenName: "John",
        familyName: "Doe",
        // Date objects form DB queries can be returned directly and transformed to string by fast-json-stringify
        joinedAt: new Date(),
      })
    }
  )
}

const callbackPlugin: FastifyPluginCallbackJsonSchemaToTs<{
  ValidatorSchemaOptions: { references: [typeof schemaPerson] }
  SerializerSchemaOptions: {
    references: [typeof schemaPerson]
    deserialize: [{ pattern: { type: "string"; format: "date-time" }; output: Date }]
  };
}> = (fastify, options, done) => {
  // Type check for custom options
  expectType<string>(options.optionA)

  // Schema is already added above
  // fastify.addSchema(schemaPerson);

  fastify.get(
    "/callback-profile",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            user: { $ref: "schema:person" },
          },
          required: ["user"],
        },
        response: {
          200: { $ref: "schema:person" },
        },
      },
    },
    (req, reply) => {
      const { givenName, familyName, joinedAt } = req.body.user

      reply.send({
        givenName,
        familyName,
        joinedAt: new Date(),
      });
    }
  );

  done()
};
```
